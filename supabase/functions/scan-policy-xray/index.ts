import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getSupabaseAdmin } from "../_shared/supabaseClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { policy_vault_id, raw_policy_text, user_id, document_url } = await req.json();

    if (!raw_policy_text && !policy_vault_id && !document_url) {
      return new Response(
        JSON.stringify({ error: "Missing policy input. Provide policy_vault_id, raw_policy_text, or document_url." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_POLICY_XRAY") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_POLICY_XRAY in environment");
    }

    let policyContent = raw_policy_text || "";
    let vaultPolicy: Record<string, any> | null = null;

    if (policy_vault_id) {
      try {
        const supabase = getSupabaseAdmin();
        const { data } = await supabase
          .from("user_policies")
          .select("*")
          .eq("id", policy_vault_id)
          .single();
        if (data) {
          vaultPolicy = data;
          policyContent = data.raw_extracted_text || JSON.stringify(data.extracted_terms);
        }
      } catch (err) {
        console.warn("Vault policy fetch warning:", err);
      }
    }

    // A+ Grade Prompt following Context Engineering guidelines
    const systemInstruction = `
<role_and_objective>
You are the Overturn Policy X-Ray Forensic Diagnostic Engine.
Your objective is to inspect an insurance policy contract and expose fine-print traps, hidden sub-limits, proportional deduction penalties, and pre-existing disease exposure BEFORE or AFTER a claim occurs.
</role_and_objective>

<rules_and_statutes>
1. PROPORTIONAL DEDUCTION AUDIT:
   - Check if room rent is capped (e.g. 1% of Sum Insured).
   - Flag the catastrophic Proportional Deduction Clause: If a patient chooses a room even ₹500 above the cap, insurers proportionally deduct all associate medical fees (surgeon, anaesthetist, diagnostics, OT charges).
2. CO-PAY & WAITING PERIOD AUDIT:
   - Identify mandatory co-pay (e.g., 20% on all senior citizen claims or zone-based treatments).
   - Check Pre-Existing Condition waiting periods (24 vs 36 vs 48 months).
   - Check Section 45 Insurance Act 1938 moratorium (if active > 3 years, the policy is legally incontestable).
3. DISEASE-SPECIFIC SUB-LIMITS:
   - Highlight caps on joint replacement, robotic surgery, cataract, hernia, cardiac stents.
4. HEALTHCARE VULNERABILITY SCORE:
   - Calculate a score from 0 to 100 (100 = bulletproof with zero co-pay, single private AC room, and restoration; <50 = dangerous fine-print traps).
</rules_and_statutes>
`;

    const prompt = `
<source_data>
${policyContent || `Document URL: ${document_url}`}
${vaultPolicy ? `\nVault Policy Name: ${vaultPolicy.policy_name} | Insurer: ${vaultPolicy.insurer_name}` : ""}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "policy_vulnerability_score": number, // 0 to 100
  "risk_tier": "Low Risk (Comprehensive)" | "Moderate Risk (Hidden Sub-limits)" | "High Risk (Severe Fine-Print Traps)",
  "room_rent_audit": {
    "is_capped": boolean,
    "limit_description": string,
    "proportional_deduction_trap_active": boolean,
    "financial_risk_warning": string
  },
  "sub_limits_found": [
    {
      "category": string,
      "limit_amount": string,
      "risk_level": "High" | "Medium" | "Low"
    }
  ],
  "co_payment_clauses": [
    {
      "trigger": string,
      "deduction_percentage": string
    }
  ],
  "waiting_period_exposure": {
    "ped_months": number,
    "incontestable_status": "Incontestable under Section 45" | "Contestable (Under 3 Years)",
    "specific_illness_waiting": string
  },
  "hidden_gotchas_list": string[],
  "counter_strategy_recommendations": string[]
}
</output_contract>

<verification_criteria>
- If room rent has a 1% or 2% cap, proportional_deduction_trap_active must be true.
- Score must be between 0 and 100, mathematically reflecting the presence of co-pays, sub-limits, and room rent caps.
- Never hallucinate sub-limits, waiting periods, or co-pays not present in the source policy text; emit null or empty arrays if unmentioned.
- Return strictly valid JSON without markdown wrapping.
</verification_criteria>
`;

    const xrayResult = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      temperature: 0.1,
      allowDeepReasoning: false, // Low token consumption for scanning
    });

    // Record in public.policy_scans
    let scanId = null;
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("policy_scans")
        .insert({
          user_id: user_id || null,
          policy_vault_id: policy_vault_id || null,
          policy_name: vaultPolicy?.policy_name || "Scanned Policy Schedule",
          insurer_name: vaultPolicy?.insurer_name || "Unknown Insurer",
          room_rent_limit: xrayResult.room_rent_audit?.limit_description || "Audited",
          copay_percentage: xrayResult.co_payment_clauses?.[0]?.deduction_percentage || "0%",
          icu_capping: xrayResult.room_rent_audit?.is_capped ? "Capped" : "No Capping",
          waiting_period_summary: `${xrayResult.waiting_period_exposure?.ped_months || 0} months PED`,
          hidden_gotchas: xrayResult.hidden_gotchas_list || [],
          recommendations: xrayResult.counter_strategy_recommendations || [],
          scan_result: xrayResult,
        })
        .select("id")
        .single();

      if (!error && data) {
        scanId = data.id;
      }
    } catch (dbErr) {
      console.warn("DB policy scan insert non-fatal error:", dbErr);
    }

    return new Response(
      JSON.stringify({
        scan_id: scanId,
        ...xrayResult,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
