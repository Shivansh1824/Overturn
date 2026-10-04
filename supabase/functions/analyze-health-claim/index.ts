import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";
import { getSupabaseAdmin } from "../_shared/supabaseClient.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let {
      claim_id,
      extracted_text,
      clinical_notes_text,
      policy_vault_id,
      policy_details,
    } = await req.json();

    // Dual-Input Resolution: If claim_id is passed, pull any missing denial or policy references directly from DB
    if (claim_id && (!extracted_text || !policy_vault_id)) {
      try {
        const supabase = getSupabaseAdmin();
        const { data: claimData } = await supabase
          .from("claim_cases")
          .select("*")
          .eq("claim_id", claim_id)
          .single();
        if (claimData) {
          if (!extracted_text && claimData.denial_reason) extracted_text = claimData.denial_reason;
          if (!policy_vault_id && claimData.policy_vault_id) policy_vault_id = claimData.policy_vault_id;
        }
      } catch (err) {
        console.warn("DB claim fallback lookup warning:", err);
      }
    }

    // MANDATORY POLICY ENFORCEMENT: A policy must be linked or explicitly specified
    if (!policy_vault_id && !policy_details?.policy_number && !policy_details?.insurer_name) {
      return new Response(
        JSON.stringify({
          error: "Mandatory Policy Required: An audit-proof appeal cannot be generated without verifying your policy terms. Please select a policy from your Policy Vault or upload your policy schedule.",
          code: "POLICY_REQUIRED",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!extracted_text) {
      return new Response(
        JSON.stringify({ error: "Missing extracted_text from denial letter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_HEALTH") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_HEALTH in environment");
    }

    // If policy_vault_id is supplied, fetch the policy from DB
    let vaultPolicy: Record<string, any> | null = null;
    if (policy_vault_id) {
      try {
        const supabase = getSupabaseAdmin();
        const { data } = await supabase
          .from("user_policies")
          .select("*")
          .eq("id", policy_vault_id)
          .single();
        if (data) vaultPolicy = data;
      } catch (err) {
        console.warn("Vault policy lookup warning:", err);
      }
    }

    // A+ Grade Prompt following Context Engineering guidelines
    const systemInstruction = `
<role_and_objective>
You are the Overturn Principal Clinical & Legal Health Insurance Appeals Specialist.
Your mission is to rigorously cross-audit insurer health claim repudiations against:
1. The Insurer's Repudiation Letter (Denial code e.g. PR-50, CO-16, MN-04, alleged lack of active line of treatment, pre-existing disease non-disclosure).
2. The Patient's Verified Policy Contract (Sum insured, waiting period elapsed, room rent sub-limits, modern daycare treatment riders).
3. The Patient's Clinical Charts (Doctor consultation notes, operative summary, pathology/biopsy reports, vitals, ICD-10 and CPT codes).
4. Statutory Indian Insurance Law:
   - Section 45 of Insurance Act 1938 (Incontestability: after 3 years, a policy cannot be repudiated on grounds of misstatement).
   - IRDAI Master Circular on Protection of Policyholders' Interests 2024 (Mandatory 15-day claim grievance SLA, prohibition of arbitrary daycare rejections).
   - Supreme Court Precedent (Manmohan Nanda v. United India Insurance Co. 2021: Insurer cannot repudiate on undisclosed conditions unrelated to the insured medical event).
</role_and_objective>

<honesty_engine>
- IF REJECTION IS LEGITIMATE: If the claim is genuinely and unequivocally barred by law or policy terms (e.g., policy lapsed prior to hospitalization, or unapproved elective cosmetic surgery with zero therapeutic necessity), set "is_rejection_legitimate": true. Provide the precise legal rationale and formulate a 4-step Financial Hardship Playbook (Hospital tariff reduction request under GIPSA PPN rules, Ex-Gratia compassionate appeal to Head of Claims, unbundled benefits recovery, hospital interest-free EMI plan).
- IF REJECTION IS UNFAIR OR REVERSIBLE: Set "is_rejection_legitimate": false. Formulate the Evidence Battle Board, win score (0-100), insurer trap flagged, 15-day IRDAI SLA tracker, and an audit-proof Formal Legal-Medical Appeal Dossier with physician sign-off block.
</honesty_engine>
`;

    const prompt = `
<source_data>
--- INSURER REJECTION LETTER & EXTRACTED DATA ---
${extracted_text}

--- CLINICAL MEDICAL RECORDS / DOCTOR NOTES ---
${clinical_notes_text || "Referenced within denial letter or hospital chart extracts"}

--- POLICY CONTRACT TERMS ---
${vaultPolicy ? `Vault Policy: ${JSON.stringify(vaultPolicy.extracted_terms)} | Policy: ${vaultPolicy.policy_name} (#${vaultPolicy.policy_number}) | Insurer: ${vaultPolicy.insurer_name}` : JSON.stringify(policy_details)}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "is_rejection_legitimate": boolean,
  "denial_analysis": {
    "denial_code": string | null,
    "alleged_reason": string,
    "insurer_clause_cited": string
  },
  "overturn_probability": {
    "score": number, // 0 to 100
    "rating": "High" | "Moderate" | "Low",
    "key_factor": string
  },
  "evidence_battle_board": [
    {
      "allegation": string,
      "clinical_proof": string,
      "source_document": string,
      "page_number": number,
      "rebuttal_strength": "Smoking Gun" | "Strong" | "Corroborative"
    }
  ],
  "insurer_trap_flagged": string,
  "statutory_mandates": {
    "irda_regulation": string,
    "sla_deadline_days": 15,
    "statutory_deadline_date": string
  },
  "step_by_step_action_plan": [
    {
      "step_number": number,
      "title": string,
      "action": string
    }
  ],
  "financial_hardship_playbook": [
    {
      "step": number,
      "channel": string,
      "strategy": string
    }
  ] | null,
  "formal_appeal_dossier_markdown": string,
  "gro_email": string,
  "ombudsman_centre": string
}
</output_contract>

<verification_criteria>
- If is_rejection_legitimate is false: evidence_battle_board MUST contain at least 2 clinical rebuttals citing exact proof from source records, financial_hardship_playbook can be null, and formal_appeal_dossier_markdown must be a comprehensive legal-medical notice citing IRDAI regulations.
- If is_rejection_legitimate is true: financial_hardship_playbook MUST contain 4 actionable steps (tariff reduction, ex-gratia, unbundled recovery, EMI), and evidence_battle_board can be an empty array [].
- Never hallucinate policy terms or clinical findings not in the source documents. If a field is unknown, emit null.
- Provide verified GRO email and regional Insurance Ombudsman center for the insurer.
</verification_criteria>
`;

    const result = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      enableGrounding: true,
      temperature: 0.1,
      allowDeepReasoning: true, // Controlled by daily reasoning cap in _shared/gemini.ts
    });

    // Update claim_cases if claim_id is provided
    if (claim_id) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("claim_cases")
          .update({
            overturn_score: result.overturn_probability?.score || 50,
            confidence_rating: result.overturn_probability?.rating || "Moderate",
            ai_evidence_matches: result.evidence_battle_board || [],
            insurer_intelligence: {
              gro_email: result.gro_email,
              ombudsman_centre: result.ombudsman_centre,
              trap: result.insurer_trap_flagged,
            },
            appeal_letter_markdown: result.formal_appeal_dossier_markdown || "",
            policy_vault_id: policy_vault_id || null,
            status: "ready_for_review",
          })
          .eq("claim_id", claim_id);
      } catch (dbErr) {
        console.warn("DB update non-fatal error:", dbErr);
      }
    }

    return new Response(JSON.stringify(result), {
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
