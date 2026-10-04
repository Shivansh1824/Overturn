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
      claim_id,
      extracted_text,
      incident_proof_text,
      policy_vault_id,
      policy_details,
    } = await req.json();

    // MANDATORY POLICY ENFORCEMENT
    if (!policy_vault_id && !policy_details?.policy_number && !policy_details?.insurer_name) {
      return new Response(
        JSON.stringify({
          error: "Mandatory Policy Required: Consumer, travel, and warranty disputes require contract verification. Please select or upload your policy schedule or warranty contract.",
          code: "POLICY_REQUIRED",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!extracted_text) {
      return new Response(
        JSON.stringify({ error: "Missing extracted_text from denial letter or rejection notice" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_OTHER") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_OTHER in environment");
    }

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
You are the Overturn Consumer & General Insurance Dispute Adjudicator.
Your mission is to audit claim denials for:
1. Consumer Electronic Device Protection & Extended Warranties (Screen break, liquid damage, motherboard repair disputes).
2. Travel Insurance (Overseas medical hospitalization, flight cancellation, baggage loss, passport theft).
3. Home, Property, Fire, and Burglary claims.

You evaluate disputes under:
- Consumer Protection Act 2019 (Section 2(11) Deficiency in Service, Section 2(47) Unfair Trade Practice, and Section 35 District Consumer Commission jurisdiction).
- IRDAI Policyholder Protection Regulations 2024.
- National Consumer Disputes Redressal Commission (NCDRC) binding precedents.
</role_and_objective>

<honesty_engine>
- IF REJECTION IS LEGITIMATE: (e.g., Warranty expired 6 months before incident, or intentional willful physical destruction), set "is_rejection_legitimate": true and formulate an Alternative Dispute Playbook (Direct brand escalation, OEM service center goodwill repair discount, National Consumer Helpline NCH 1915 docket).
- IF REJECTION IS UNFAIR OR AMBIGUOUS: Set "is_rejection_legitimate": false. Formulate the Evidence Battle Board, win score, consumer trap flagged, and a pre-litigation Legal Notice under Consumer Protection Act 2019.
</honesty_engine>
`;

    const prompt = `
<source_data>
--- REJECTION NOTICE & DISPUTE DETAILS ---
${extracted_text}

--- INCIDENT PROOF / INVOICE / SERVICE ESTIMATE ---
${incident_proof_text || "Referenced within the claim documents"}

--- POLICY / WARRANTY CONTRACT TERMS ---
${vaultPolicy ? `Vault Policy: ${JSON.stringify(vaultPolicy.extracted_terms)} | Policy: ${vaultPolicy.policy_name} (#${vaultPolicy.policy_number}) | Insurer: ${vaultPolicy.insurer_name}` : JSON.stringify(policy_details)}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "is_rejection_legitimate": boolean,
  "denial_analysis": {
    "domain": "gadget_warranty" | "travel_claim" | "home_property" | "commercial_general",
    "alleged_reason": string,
    "exclusion_clause_cited": string
  },
  "overturn_probability": {
    "score": number, // 0 to 100
    "rating": "High" | "Moderate" | "Low",
    "key_factor": string
  },
  "evidence_battle_board": [
    {
      "allegation": string,
      "proof_and_statute": string,
      "source_document": string,
      "page_number": number,
      "rebuttal_strength": "Smoking Gun" | "Strong" | "Corroborative"
    }
  ],
  "insurer_trap_flagged": string,
  "statutory_mandates": {
    "act_citation": "Consumer Protection Act 2019 (Sections 2(11) and 35)",
    "sla_deadline_days": 15,
    "remedy": "Full replacement value or repair cost with 12% interest for mental agony"
  },
  "formal_appeal_dossier_markdown": string,
  "gro_email": string,
  "ombudsman_centre": string
}
</output_contract>

<verification_criteria>
- Must formulate formal legal notice invoking Consumer Protection Act 2019.
- Provide verified GRO email and escalation channel.
</verification_criteria>
`;

    const result = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      enableGrounding: true,
      temperature: 0.1,
      allowDeepReasoning: true,
    });

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
