export interface ClaimCase {
  id: string;
  case_title: string;
  patient_name: string;
  insurer_name: string;
  domain: 'health' | 'motor';
  claim_amount: number;
  formatted_amount: string;
  denial_code: string;
  alleged_reason: string;
  expected_verdict: string;
  win_probability: number;
  key_statute: string;
  smoking_gun: {
    title: string;
    source: string;
    summary: string;
    clinical_citation: string;
  };
  policy_shield: {
    clause: string;
    protection_clause: string;
  };
  steps: {
    title: string;
    telemetry: string;
    durationMs: number;
    status: 'idle' | 'running' | 'completed';
    detail: string;
  }[];
}

export type AgentStatus = 'idle' | 'analyzing' | 'extracting' | 'verifying' | 'overturned';
