import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getSupabaseAdmin } from "../_shared/supabaseClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { document_url, raw_text, user_id, beneficiary_name = "Self", beneficiary_relationship = "self" } = await req.json();

    if (!raw_text && !document_url) {
      return new Response(
        JSON.stringify({ error: "Missing document_url or raw_text for policy schedule" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_ROUTER") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_ROUTER in environment");
    }

    // A+ Grade Prompt following Context Engineering guidelines
    const systemInstruction = `
<role_and_objective>
You are the Overturn Policy Vault Extraction Engine.
Your objective is to ingest insurance policy schedules, master contracts, or health cards (Health, Motor, or Other), extract all contractual parameters, financial limits, and hidden sub-limit clauses, and convert them into structured, queryable policy contract records.
</role_and_objective>

<rules_and_statutes>
1. CONTRACTUAL FIDELITY: Extract exact monetary limits, percentage co-pays, and waiting periods as documented. Do not round numbers or assume standard coverage. If an element is absent, emit null.
2. TYPES & SUBTYPES:
   - "insurance_type": "health" | "motor" | "other"
   - "policy_subtype": "family_floater" | "individual" | "group_corporate" | "senior_citizen" | "zero_dep" | "comprehensive_motor" | "third_party" | "extended_warranty" | "travel_overseas"
3. EXTRACTED TERMS SCHEMA:
   - room_rent_capping: e.g., "1% of Sum Insured", "Single Private A/C Room", or "No Capping"
   - co_pay: e.g., "10% for age > 60", "Nil"
   - waiting_periods: initial (30d), pre_existing (e.g. 24 or 36 months), specific illnesses (24 months)
   - restore_benefit: boolean or description
   - cumulative_bonus: e.g., "50% per claim-free year up to 100%"
   - exclusions: list of specific excluded treatments/items
</rules_and_statutes>
`;

    const prompt = `
<source_data>
${raw_text || `Document URL: ${document_url}`}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "insurer_name": string | null,
  "policy_name": string | null,
  "policy_number": string | null,
  "insurance_type": "health" | "motor" | "other",
  "policy_subtype": string,
  "sum_insured": number | null,
  "start_date": string | null,
  "expiry_date": string | null,
  "extracted_terms": {
    "room_rent_capping": string | null,
    "co_pay": string | null,
    "waiting_periods": {
      "initial": string | null,
      "specific_illnesses": string | null,
      "pre_existing_diseases": string | null
    },
    "day_care_procedures": string | null,
    "maternity_benefit": string | null,
    "special_endorsements": string[],
    "key_exclusions": string[]
  },
  "raw_extracted_text": string
}
</output_contract>

<verification_criteria>
- If the policy mentions vehicles, chassis, engine, or IDV, insurance_type must be "motor".
- If the policy mentions hospital, surgery, sum insured, or TPA, insurance_type must be "health".
- Return raw_extracted_text with full original wording.
</verification_criteria>
`;

    const parsedPolicy = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      temperature: 0.1,
    });

    // Save to public.user_policies in Supabase Vault
    let policyId = null;
    try {
      const supabase = getSupabaseAdmin();
      const insertData: Record<string, any> = {
        beneficiary_name,
        beneficiary_relationship,
        policy_number: parsedPolicy.policy_number || null,
        insurer_name: parsedPolicy.insurer_name || "Unknown Insurer",
        policy_name: parsedPolicy.policy_name || "Standard Policy",
        insurance_type: parsedPolicy.insurance_type || "health",
        policy_subtype: parsedPolicy.policy_subtype || null,
        sum_insured: parsedPolicy.sum_insured || 0,
        document_url: document_url || null,
        raw_extracted_text: parsedPolicy.raw_extracted_text || raw_text || "",
        extracted_terms: parsedPolicy.extracted_terms || {},
      };

      if (user_id) {
        insertData.user_id = user_id;
      }

      const { data, error } = await supabase
        .from("user_policies")
        .insert(insertData)
        .select("id")
        .single();

      if (!error && data) {
        policyId = data.id;
      }
    } catch (dbErr) {
      console.warn("DB insert non-fatal error:", dbErr);
    }

    return new Response(
      JSON.stringify({
        policy_vault_id: policyId,
        ...parsedPolicy,
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
