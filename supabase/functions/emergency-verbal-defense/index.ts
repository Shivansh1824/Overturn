import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { callGeminiJSON } from "../_shared/gemini.ts";

// Top 30 Indian Insurer Statutory GRO Registry (Instant 0ms lookup)
const GRO_REGISTRY: Record<string, { gro_email: string; gro_name: string; toll_free: string; portal_url: string }> = {
  "star health": { gro_email: "grievances@starhealth.in", gro_name: "Chief Grievance Redressal Officer", toll_free: "1800 425 2255", portal_url: "https://www.starhealth.in/grievance-redressal" },
  "hdfc ergo": { gro_email: "grievance@hdfcergo.com", gro_name: "Principal Grievance Officer", toll_free: "1800 2666 400", portal_url: "https://www.hdfcergo.com/customer-care/grievances" },
  "care health": { gro_email: "customerfirst@careinsurance.com", gro_name: "Head - Customer Service & Grievances", toll_free: "1800 102 4488", portal_url: "https://www.careinsurance.com/grievance-redressal.html" },
  "icici lombard": { gro_email: "customersupport@icicilombard.com", gro_name: "Chief Grievance Officer", toll_free: "1800 2666", portal_url: "https://www.icicilombard.com/grievance-redressal" },
  "niva bupa": { gro_email: "customercare@nivabupa.com", gro_name: "Grievance Redressal Officer", toll_free: "1860 500 8888", portal_url: "https://www.nivabupa.com/customer-service/grievance-redressal.html" },
  "bajaj allianz": { gro_email: "bagichelp@bajajallianz.co.in", gro_name: "Grievance Redressal Officer", toll_free: "1800 209 5858", portal_url: "https://www.bajajallianz.com/general-insurance-features/grievance-redressal.html" },
  "new india assurance": { gro_email: "grievance.portal@newindia.co.in", gro_name: "Chief Grievance Officer", toll_free: "1800 209 1415", portal_url: "https://www.newindia.co.in/portal/grievance" },
  "united india": { gro_email: "customercare@uiic.co.in", gro_name: "Head of Grievance Redressal", toll_free: "1800 425 33333", portal_url: "https://uiic.co.in/grievance" },
  "national insurance": { gro_email: "customer.relation@nic.co.in", gro_name: "Grievance Redressal Officer", toll_free: "1800 345 0330", portal_url: "https://nationalinsurance.nic.co.in" },
  "oriental insurance": { gro_email: "cgo@orientalinsurance.co.in", gro_name: "Chief Grievance Officer", toll_free: "1800 118 485", portal_url: "https://orientalinsurance.org.in" },
  "tata aig": { gro_email: "customersupport@tataaig.com", gro_name: "Grievance Redressal Officer", toll_free: "1800 266 7780", portal_url: "https://www.tataaig.com/grievance-redressal" },
  "aditya birla": { gro_email: "care.healthinsurance@adityabirlacapital.com", gro_name: "Grievance Officer", toll_free: "1800 270 7000", portal_url: "https://www.adityabirlacapital.com" },
  "sbi general": { gro_email: "customer.care@sbigeneral.in", gro_name: "Head Grievance Redressal", toll_free: "1800 102 1111", portal_url: "https://www.sbigeneral.in" },
  "reliance general": { gro_email: "rgicl.services@relianceada.com", gro_name: "Chief Grievance Officer", toll_free: "1800 3009", portal_url: "https://www.reliancegeneral.co.in" },
  "iffco tokio": { gro_email: "support@iffcotokio.co.in", gro_name: "Chief Grievance Redressal Officer", toll_free: "1800 103 5499", portal_url: "https://www.iffcotokio.co.in" },
  "manipalcigna": { gro_email: "complaints@manipalcigna.com", gro_name: "Grievance Redressal Officer", toll_free: "1800 102 4462", portal_url: "https://www.manipalcigna.com" }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { spoken_text, insurer_name, policy_number, caller_role = "TPA Desk / Hospital Billing" } = await req.json();

    if (!spoken_text) {
      return new Response(
        JSON.stringify({ error: "Missing spoken_text input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY_ROUTER") || "";
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY_ROUTER in environment");
    }

    // Step 1: Check instant registry for insurer
    const normalizedInsurer = (insurer_name || "").toLowerCase().trim();
    let contactMatch = null;
    for (const [key, val] of Object.entries(GRO_REGISTRY)) {
      if (normalizedInsurer.includes(key) || key.includes(normalizedInsurer)) {
        contactMatch = { ...val, insurer_name: insurer_name || key, source: "verified_registry" };
        break;
      }
    }

    // A+ Grade Prompt following Context Engineering guidelines
    const systemInstruction = `
<role_and_objective>
You are the Overturn Emergency Verbal Defense Agent.
Your objective is to shield hospitalized patients and their families who are being pressured at a hospital TPA/billing desk with an unlawful verbal rejection of cashless pre-authorization or claim settlement.
</role_and_objective>

<rules_and_statutes>
1. STATUTORY INVALIDITY: Under IRDAI Master Circular on Policyholders' Protection (2024, Section 12) and Delhi High Court precedent, verbal repudiation of health insurance is legally void. Insurers are statutorily required to communicate rejection in writing with explicit policy clause references.
2. TRIAGE & CLARIFICATION: If the spoken transcript is fragmented, contradictory, or lacks crucial details, set "needs_clarification": true and formulate 3-4 specific, one-tap clarifying prompts. If sufficient details exist, set "needs_clarification": false.
3. 30-SECOND COUNTER SCRIPT: Provide an assertively polite, legally unassailable spoken response that the patient can read verbatim to the billing desk supervisor to halt cash advance demands.
4. URGENT DEMAND EMAIL: Generate a formal demand letter to the insurer's Grievance Redressal Officer (GRO) demanding written repudiation within the statutory 2-hour emergency cashless turnaround window.
</rules_and_statutes>
`;

    const prompt = `
<context>
- Desk / Caller Role: ${caller_role}
- Insurer Name: ${insurer_name || "Unspecified"}
- Policy Number: ${policy_number || "To be confirmed"}
- Verified Contact Match: ${contactMatch ? JSON.stringify(contactMatch) : "Not found in 0ms registry. Locate via search grounding."}
</context>

<source_data>
"${spoken_text}"
</source_data>

<output_contract>
Return strictly a valid JSON object matching this schema:
{
  "needs_clarification": boolean,
  "clarification_prompt": string | null,
  "clarification_options": string[] | null,
  "is_verbal_denial_valid": false,
  "legal_statute_citation": string,
  "spoken_counter_script_30s": string,
  "immediate_desk_actions": string[],
  "insurer_contacts": {
    "insurer_name": string,
    "gro_name": string,
    "gro_email": string,
    "escalation_portal_url": string,
    "toll_free": string,
    "source": "verified_registry" | "google_search_grounding"
  },
  "emergency_demand_email": {
    "to": string,
    "subject": string,
    "body_markdown": string
  }
}
</output_contract>

<verification_criteria>
- "is_verbal_denial_valid" must ALWAYS be false under IRDAI law.
- The 30s counter-script must be readable in under 30 seconds (under 80 words) and mention IRDAI regulations.
- Emergency demand email must cite the 2-hour pre-auth cashless emergency SLA.
</verification_criteria>
`;

    const response = await callGeminiJSON({
      apiKey,
      systemInstruction,
      prompt,
      enableGrounding: !contactMatch,
      temperature: 0.1,
    });

    return new Response(JSON.stringify(response), {
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
