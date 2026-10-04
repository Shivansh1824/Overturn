import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getSupabaseAdmin } from "../_shared/supabaseClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      document_url,
      raw_text,
      insurer_name,
      policy_name,
      policy_number,
      sum_insured,
      user_id,
      beneficiary_name = "Self",
      beneficiary_relationship = "self",
    } = await req.json();

    // Check if at least one input pathway is provided: Document OR Policy Plan search
    const hasDocument = Boolean(raw_text || document_url);
    const hasPolicyPlan = Boolean(policy_name || (insurer_name && policy_number));

    if (!hasDocument && !hasPolicyPlan) {
      return new Response(
        JSON.stringify({
          error: "Missing policy input: Please provide either a policy document (PDF/Image) OR your policy name and insurer name for Google Grounding retrieval.",
          code: "INPUT_REQUIRED",
        }),
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
You are the Overturn Policy Vault Extraction & Web-Grounding Engine.
Your objective is to ingest insurance policies either from:
1. DOCUMENT EXTRACTION: Ingesting an uploaded policy schedule / card / booklet PDF or OCR text.
2. ZERO-UPLOAD WEB GROUNDING: When a user only provides their Insurer Name and Policy Plan Name, use Google Search Grounding to retrieve the official IRDAI-approved Customer Information Sheet (CIS), Policy Wordings, and Prospectus.
</role_and_objective>

<rules_and_statutes>
1. CONTRACTUAL FIDELITY: Extract exact monetary limits, percentage co-pays, and waiting periods as documented in the master policy. If an element is absent or not mentioned in public filings, emit null.
2. DOMAIN TYPES:
   - "insurance_type": "health" | "motor" | "other"
   - "policy_subtype": "family_floater" | "individual" | "group_corporate" | "senior_citizen" | "zero_dep" | "comprehensive_motor" | "extended_warranty"
3. EXTRACTED TERMS SCHEMA:
   - room_rent_capping: e.g., "Single Private A/C Room", "1% of Sum Insured", or "No Capping"
   - co_pay: e.g., "10% for age > 60", "Nil"
   - waiting_periods: initial (30d), pre_existing (e.g. 24 or 36 months), specific illnesses (24 months)
   - restore_benefit: boolean or description
   - cumulative_bonus: e.g., "50% per claim-free year up to 100%"
   - key_exclusions: list of specific excluded treatments/items
4. RETRIEVAL MODE:
   - If document is provided: set "retrieval_mode": "document_ocr"
   - If retrieved via web search: set "retrieval_mode": "web_grounded_master_policy"
</rules_and_statutes>
`;

    const prompt = hasDocument
      ? `
<source_data>
--- UPLOADED POLICY DOCUMENT CONTENT ---
${raw_text || `Document URL: ${document_url}`}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "retrieval_mode": "document_ocr",
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
`
      : `
<grounding_query>
The user did not upload a PDF document. They provided the policy plan details:
- Insurer Name: ${insurer_name || "Unspecified"}
- Policy Plan Name: ${policy_name || "Standard Health Plan"}
- Policy Number: ${policy_number || "Reference not provided"}
- Indicative Sum Insured: ${sum_insured || "Standard sum insured"}

Use Google Search Grounding to search the official published policy wordings, customer information sheet (CIS), and IRDAI prospectus for:
"${insurer_name || ""} ${policy_name || ""} policy wordings prospectus room rent waiting period co-pay exclusions"
Retrieve the official contractual terms for this policy plan.
</grounding_query>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "retrieval_mode": "web_grounded_master_policy",
  "insurer_name": "${insurer_name || ""}",
  "policy_name": "${policy_name || ""}",
  "policy_number": ${policy_number ? `"${policy_number}"` : null},
  "insurance_type": "health" | "motor" | "other",
  "policy_subtype": string,
  "sum_insured": ${sum_insured ? Number(sum_insured) : null},
  "start_date": null,
  "expiry_date": null,
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
- Ground extraction in the official published policy wordings for "${insurer_name} ${policy_name}".
- If specific waiting periods or room rent terms are standard for this plan, extract them faithfully.
- Return raw_extracted_text summarizing the official terms found.
</verification_criteria>
`;

    const parsedPolicy = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      enableGrounding: !hasDocument, // Enable Google Search Grounding for zero-upload mode
      temperature: 0.1,
    });

    // Save to public.user_policies in Supabase Vault
    let policyId = null;
    try {
      const supabase = getSupabaseAdmin();
      const insertData: Record<string, any> = {
        beneficiary_name,
        beneficiary_relationship,
        policy_number: parsedPolicy.policy_number || policy_number || null,
        insurer_name: parsedPolicy.insurer_name || insurer_name || "Unknown Insurer",
        policy_name: parsedPolicy.policy_name || policy_name || "Standard Policy",
        insurance_type: parsedPolicy.insurance_type || "health",
        policy_subtype: parsedPolicy.policy_subtype || null,
        sum_insured: parsedPolicy.sum_insured || sum_insured || 0,
        document_url: document_url || null,
        raw_extracted_text: parsedPolicy.raw_extracted_text || raw_text || `Grounded from ${insurer_name} ${policy_name}`,
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
