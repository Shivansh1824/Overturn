// Overturn: Robust Multi-Model Gemini Caller with Fallbacks, Quota Guards & Zero-Leak Security

interface GeminiCallOptions {
  apiKey: string;
  systemInstruction?: string;
  prompt: string;
  enableGrounding?: boolean;
  temperature?: number;
  allowDeepReasoning?: boolean;
  timeoutMs?: number;
}

// Fallback Model Hierarchy (Modern Models only):
// 1. Primary: gemini-flash-lite-latest (fastest, lightweight, generous rate limit)
// 2. Fallback 1: gemini-3.5-flash-lite (latest generation lightweight)
// 3. Fallback 2: gemini-3.1-flash-lite
// 4. Escalation: gemini-3.5-flash (guarded with strict daily reasoning cap to protect free tier)
const MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
];

// In-memory daily reasoning process tracker to protect Free Tier quota (max 3 per day)
let dailyReasoningCount = 0;
let reasoningResetDay = new Date().getUTCDate();

function getReasoningBudget(model: string, allowDeepReasoning: boolean): number {
  const currentDay = new Date().getUTCDate();
  if (currentDay !== reasoningResetDay) {
    dailyReasoningCount = 0;
    reasoningResetDay = currentDay;
  }

  // Flash-lite models don't require heavy thinking tokens
  if (model.includes("flash-lite")) {
    return 0;
  }

  // For gemini-3.5-flash: allow reasoning only if explicitly permitted AND within daily cap (max 3/day)
  if (model.includes("3.5-flash") && allowDeepReasoning && dailyReasoningCount < 3) {
    dailyReasoningCount++;
    console.log(`[Overturn Quota Guard] Deep reasoning activated (${dailyReasoningCount}/3 today)`);
    return 1024; // Moderate reasoning budget
  }

  // Otherwise, default to 0 to preserve power and prevent timeout
  return 0;
}

export async function callGeminiJSON<T = any>(options: GeminiCallOptions): Promise<T> {
  const {
    apiKey,
    systemInstruction,
    prompt,
    enableGrounding = false,
    temperature = 0.1,
    allowDeepReasoning = false,
    timeoutMs = 25000,
  } = options;

  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Ensure required environment secret is configured.");
  }

  let lastError: Error | null = null;

  for (const model of MODELS) {
    const thinkingBudget = getReasoningBudget(model, allowDeepReasoning);

    // If grounding was requested, we first try with grounding; if free-tier quota rejects it, we retry without grounding
    const groundingModes = enableGrounding ? [true, false] : [false];

    for (const withGrounding of groundingModes) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const payload: Record<string, any> = {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature,
              responseMimeType: "application/json",
            },
          };

          // Explicitly control thinking budget
          if (thinkingBudget > 0) {
            payload.generationConfig.thinkingConfig = {
              thinkingBudget,
            };
          }

          if (systemInstruction) {
            payload.systemInstruction = {
              parts: [{ text: systemInstruction }],
            };
          }

          // Enable Google Search Grounding only if requested and supported
          if (withGrounding) {
            payload.tools = [{ googleSearch: {} }];
          }

          const resp = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!resp.ok) {
            const errText = await resp.text();
            // Sanitize any key occurrences in error message
            const sanitizedErr = errText.replace(/key=[A-Za-z0-9_\-]+/g, "key=REDACTED").slice(0, 200);

            // If free tier quota rejects grounding tools (429 RESOURCE_EXHAUSTED), break inner loop to try without grounding
            if (resp.status === 429 && withGrounding) {
              console.warn(`[Overturn Quota] Grounding tool restricted on current tier for ${model}. Retrying without grounding...`);
              break;
            }

            if (resp.status === 429) {
              // Rate limit on standard generation: backoff and retry
              const delay = Math.pow(2, attempt) * 1200 + Math.random() * 400;
              await new Promise((resolve) => setTimeout(resolve, delay));
              continue;
            }

            throw new Error(`Gemini API Error [${model}] (${resp.status}): ${sanitizedErr}`);
          }

          const data = await resp.json();
          const candidate = data.candidates?.[0];
          if (!candidate || !candidate.content?.parts?.[0]?.text) {
            throw new Error(`Empty response from Gemini model ${model}`);
          }

          let rawText = candidate.content.parts[0].text.trim();

          // Robust JSON extraction
          if (rawText.startsWith("```json")) {
            rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (rawText.startsWith("```")) {
            rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }

          return JSON.parse(rawText) as T;
        } catch (err: any) {
          clearTimeout(timeoutId);

          if (err.name === "AbortError") {
            lastError = new Error(`Request to model ${model} timed out after ${timeoutMs}ms`);
            break;
          }

          lastError = err;
          // If grounding failed due to quota, inner loop breaks to try withGrounding = false
          if (withGrounding && err.message?.includes("429")) {
            break;
          }
          if (!err.message?.includes("429")) {
            break;
          }
        }
      }
    }
  }

  throw lastError || new Error("All Gemini models and retry attempts exhausted");
}
