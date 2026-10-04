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
      surveyor_report_text,
      repair_estimate_text,
      policy_vault_id,
      policy_details,
    } = await req.json();

    // MANDATORY POLICY ENFORCEMENT
    if (!policy_vault_id && !policy_details?.policy_number && !policy_details?.insurer_name) {
      return new Response(
        JSON.stringify({
          error: "Mandatory Policy Required: Motor claim appeals require verification of your policy schedule, IDV, and zero-dep / add-on endorsements. Please select or upload your policy.",
          code: "POLICY_REQUIRED",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!extracted_text) {
      return new Response(
        JSON.stringify({ error: "Missing extracted_text from motor denial or surveyor assessment letter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_MOTOR") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_MOTOR in environment");
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
You are the Overturn Principal Motor Claims & Surveyor Dispute Specialist.
Your mission is to audit automobile and commercial vehicle claim repudiations, arbitrary surveyor deductions, and salvage disputes against:
1. The Insurer's Repudiation / Surveyor Assessment Report (Deductions for rubber, plastic, metal depreciation, alleged consequential damage, delayed FIR/intimation).
2. The Policy Contract Terms & Endorsements:
   - Insured Declared Value (IDV).
   - Zero Depreciation (Nil Dep / Bumper to Bumper) Rider.
   - Return to Invoice (RTI), Engine & Gearbox Protector, Consumables Cover.
   - Indian Motor Tariff (IMT) Regulations (e.g., IMT-23, IMT-47).
3. Statutory & Judicial Precedents:
   - Supreme Court of India: Gurshinder Singh v. Shriram General Insurance (2020) — Delay in informing the insurer about vehicle theft or accident after reporting immediately to police cannot be a ground to deny a genuine claim.
   - IRDAI Surveyor Regulations 2020: Mandatory surveyor appointment within 48 hours; final report submission within 30 days. Arbitrary unilateral cuts without market receipts are unlawful.
   - Motor Vehicles Act 2019: Third-party liabilities and standard own-damage norms.
</role_and_objective>

<honesty_engine>
- IF REJECTION IS LEGITIMATE: (e.g., Driver was unequivocally unlicensed at the wheel, or commercial vehicle operated without valid fitness certificate/permit), set "is_rejection_legitimate": true and formulate a 4-step Motor Hardship Resolution (Workshop direct negotiation, salvage auction bidding, third-party claim settlement, ombudsman compassionate review).
- IF REJECTION IS UNLAWFUL OR EXCESSIVELY DEDUCTED: Set "is_rejection_legitimate": false. Formulate the Evidence Battle Board, win score, surveyor trap analysis, and an audit-proof Formal Legal Appeal Dossier.
</honesty_engine>
`;

    const prompt = `
<source_data>
--- INSURER DENIAL / SURVEYOR REPORT ---
${extracted_text}

--- WORKSHOP ESTIMATE / REPAIR BILLS ---
${repair_estimate_text || surveyor_report_text || "Referenced within surveyor deduction breakdown"}

--- MOTOR POLICY SCHEDULE & ENDORSEMENTS ---
${vaultPolicy ? `Vault Policy: ${JSON.stringify(vaultPolicy.extracted_terms)} | Policy: ${vaultPolicy.policy_name} (#${vaultPolicy.policy_number}) | Insurer: ${vaultPolicy.insurer_name}` : JSON.stringify(policy_details)}
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "is_rejection_legitimate": boolean,
  "denial_analysis": {
    "dispute_type": "total_repudiation" | "excessive_depreciation" | "salvage_dispute" | "delay_in_intimation" | "engine_damage_exclusion",
    "alleged_reason": string,
    "surveyor_deductions_audited": [
      {
        "item_name": string,
        "amount_claimed": number,
        "amount_approved": number,
        "arbitrary_cut": number,
        "justification_for_reversal": string
      }
    ]
  },
  "overturn_probability": {
    "score": number, // 0 to 100
    "rating": "High" | "Moderate" | "Low",
    "key_factor": string
  },
  "evidence_battle_board": [
    {
      "allegation": string,
      "contractual_proof": string,
      "source_document": string,
      "page_number": number,
      "rebuttal_strength": "Smoking Gun" | "Strong" | "Corroborative"
    }
  ],
  "insurer_trap_flagged": string,
  "statutory_mandates": {
    "statute_citation": string,
    "sla_deadline_days": 15,
    "statutory_deadline_date": string
  },
  "formal_appeal_dossier_markdown": string,
  "gro_email": string,
  "ombudsman_centre": string
}
</output_contract>

<verification_criteria>
- If the policy has Zero Depreciation cover, surveyor deduction on plastic/fiberglass/rubber MUST be flagged as an unlawful deduction.
- Cite Gurshinder Singh (2020) if delay in intimation is the stated repudiation ground.
- Return verified GRO email and Insurance Ombudsman center.
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
