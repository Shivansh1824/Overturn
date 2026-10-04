import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getSupabaseAdmin } from "../_shared/supabaseClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { document_url, raw_text, claim_id, user_id } = await req.json();

    if (!raw_text && !document_url) {
      return new Response(
        JSON.stringify({ error: "Missing document_url or raw_text input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_ROUTER") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_ROUTER in environment");
    }

    // A+ Grade Prompt following Prompt Engineering & Context Engineering Framework
    const systemInstruction = `
<role_and_objective>
You are the Overturn Principal Intake & Document Classifier Agent.
Your objective is to read raw insurance dispute documents (repudiation letters, cashless pre-auth rejections, discharge summaries, surveyor reports, or billing schedules), perform optical forensic extraction of all key fields, and route the dispute to the appropriate specialized legal-medical adjudicator.
</role_and_objective>

<rules_and_statutes>
1. GROUNDED EXTRACTION ONLY: Extract ONLY what is documented. Never invent policy numbers, claim numbers, or amounts. If a value is missing or illegible, emit null.
2. DOMAIN ROUTING:
   - "health": Hospitalization, surgery, daycare procedures, cashless pre-authorizations, medical reimbursement denials, ICD-10 medical necessity disputes.
   - "motor": Private car, commercial vehicle, two-wheeler accident, surveyor depreciation disputes, IMT endorsements, salvage deductions.
   - "other": Consumer device warranty, home insurance, travel baggage/flight cancellations, cargo, fire, or marine disputes.
3. RAW TEXT INTEGRITY: The "raw_extracted_text" field must capture the entire unabridged document text verbatim without truncation so downstream agents can run page-and-line citations.
4. CONFIDENCE SCORING: Provide a 0.00 to 1.00 confidence rating reflecting extraction clarity and legibility.
</rules_and_statutes>
`;

    const prompt = `
<source_data>
${raw_text || `Document URL: ${document_url}`}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "document_type": "denial_letter" | "hospital_discharge" | "doctor_consult_notes" | "policy_schedule" | "surveyor_report" | "mixed",
  "detected_category": "health" | "motor" | "other",
  "policy_subtype": string,
  "confidence": number,
  "category_display_name": string,
  "insurer_name": string | null,
  "policy_number": string | null,
  "claim_id": string | null,
  "claimant_name": string | null,
  "claim_amount": number | null,
  "denial_date": string | null,
  "summary_of_rejection": string,
  "raw_extracted_text": string,
  "next_recommended_function": "analyze-health-claim" | "analyze-motor-claim" | "analyze-other-claim"
}
</output_contract>

<verification_criteria>
- If the document is health-related, next_recommended_function must be "analyze-health-claim".
- If the document is motor-related, next_recommended_function must be "analyze-motor-claim".
- Otherwise, next_recommended_function must be "analyze-other-claim".
- Do not wrap in markdown or prose.
</verification_criteria>
`;

    const extraction = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      temperature: 0.1,
    });

    // Update database record if claim_id is present
    if (claim_id) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("claim_cases")
          .update({
            patient_name: extraction.claimant_name || "Unknown",
            insurer_name: extraction.insurer_name || "Unknown",
            policy_number: extraction.policy_number || null,
            claim_amount: extraction.claim_amount || 0,
            denial_reason: extraction.summary_of_rejection || "Extracted from intake",
            status: "classified",
          })
          .eq("claim_id", claim_id);
      } catch (dbErr) {
        console.warn("DB update non-fatal error:", dbErr);
      }
    }

    return new Response(JSON.stringify(extraction), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
