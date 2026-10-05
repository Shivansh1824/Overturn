import { ClaimCase } from '../types';

export const SAMPLE_CASES: ClaimCase[] = [
  {
    id: 'case-star-alex',
    case_title: 'Star Health — Acute Spine Discectomy Denial',
    patient_name: 'Alex',
    insurer_name: 'Star Health & Allied Insurance',
    domain: 'health',
    claim_amount: 185000,
    formatted_amount: '₹1,85,000',
    denial_code: 'Clause 4.3 (Alleged Pre-Existing Disease Exclusion)',
    alleged_reason: 'Insurer claimed acute L4-L5 disc extrusion was chronic degenerative spinal disease predating policy inception.',
    expected_verdict: 'Unlawful Repudiation Overturned',
    win_probability: 95,
    key_statute: 'Section 45 of Insurance Act 1938 (4-Year Incontestability Moratorium) & IRDAI Master Circular 2024',
    smoking_gun: {
      title: 'Acute Trauma MRI & Incontestable Moratorium',
      source: 'Kokilaben Dhirubhai Ambani Hospital, Mumbai (Page 3, ¶2)',
      summary: 'MRI Lumbar Spine (25-Sep-2026) demonstrates fresh mechanical extrusion directly caused by gym trauma with zero prior disc history. Policy has run 48 continuous months, activating Section 45 statutory immunity.',
      clinical_citation: 'ICD-10 M51.26 | CPT 63030 | Incontestable Certificate: SHAHLIP21262V042021'
    },
    policy_shield: {
      clause: 'Clause 4.3 (36-Month PED Waiting Period)',
      protection_clause: 'Section 45 Statutory Moratorium: Once a policy completes 4 continuous renewal years, repudiation on grounds of non-disclosure is illegal by federal statute.'
    },
    steps: [
      {
        title: 'Denial Letter Ingestion & OCR',
        telemetry: 'Extracting denial reference Ref: SHAI/PREAUTH/2026/MUM/882104 ... Code: Clause 4.3',
        durationMs: 800,
        status: 'completed',
        detail: 'Discovered repudiation notice rejecting pre-auth for acute L4-L5 microdiscectomy.'
      },
      {
        title: 'Clinical Policy Bulletin (CPB) Mapping',
        telemetry: 'Matching Star Comprehensive Policy Schedule UIN: SHAHLIP21262V042021 ...',
        durationMs: 900,
        status: 'completed',
        detail: 'Detected 4 consecutive claim-free renewal years (48 months active tenure).'
      },
      {
        title: 'EHR Chart Cross-Audit & Smoking Gun',
        telemetry: 'Scanning Kokilaben Hospital admission notes and spine MRI dated 25-Sep-2026 ...',
        durationMs: 1100,
        status: 'completed',
        detail: 'SMOKING GUN FOUND: MRI verifies acute gym trauma rupture; zero historical treatments on record.'
      },
      {
        title: 'Statutory Appeal Dossier Generated',
        telemetry: 'Synthesizing Section 45 Insurance Act shield + IRDAI 15-day binding redressal draft ...',
        durationMs: 700,
        status: 'completed',
        detail: 'Audit-ready legal notice generated with 95% overturn probability meter.'
      }
    ]
  },
  {
    id: 'case-icici-sam',
    case_title: 'ICICI Lombard — Surveyor 50% Depreciation Slashed',
    patient_name: 'Sam',
    insurer_name: 'ICICI Lombard General Insurance',
    domain: 'motor',
    claim_amount: 62000,
    formatted_amount: '₹28,500 Slashed',
    denial_code: 'IMT Standard Depreciation Deduction (-₹28,500)',
    alleged_reason: 'Surveyor unilaterally deducted 50% depreciation on front polymer bumper and LED projector units.',
    expected_verdict: 'Full Depreciation Reversal Enforced',
    win_probability: 94,
    key_statute: 'Breach of Endorsement ZD-01 & Supreme Court Ruling (Gurshinder Singh 2020)',
    smoking_gun: {
      title: 'Active Nil-Depreciation Rider (ZD-01)',
      source: 'Certificate of Insurance #9912048 (Policy Schedule Page 1)',
      summary: 'Insured paid extra premium for Zero Depreciation Endorsement ZD-01. Under Supreme Court precedent, contractually purchased riders strictly supersede standard tariff reductions.',
      clinical_citation: 'IRDAI Surveyor #44102 Audit Violation | Endorsement ZD-01 Binding Covenant'
    },
    policy_shield: {
      clause: 'Indian Motor Tariff (IMT) Section 2 Standard Depreciation',
      protection_clause: 'Endorsement ZD-01 overrides IMT tariff reductions. 100% replacement reimbursement mandated.'
    },
    steps: [
      {
        title: 'Surveyor Sheet Ingestion',
        telemetry: 'Parsing Surveyor Report Ref: ICICI/MOT/SURV/2026/90124 ... Slashing detected: ₹28,500',
        durationMs: 750,
        status: 'completed',
        detail: 'Detected 50% deduction on polymer front bumper and LED projector assemblies.'
      },
      {
        title: 'Policy Endorsement Audit',
        telemetry: 'Cross-auditing Private Car Package Policy No: 3001/2024/098124/00 ...',
        durationMs: 850,
        status: 'completed',
        detail: 'Identified paid Zero Depreciation Add-On (Endorsement Code ZD-01) active on date of loss.'
      },
      {
        title: 'Supreme Court Case Law Linkage',
        telemetry: 'Querying national motor insurance tribunal database for tariff overriding precedents ...',
        durationMs: 1000,
        status: 'completed',
        detail: 'SMOKING GUN FOUND: Gurshinder Singh v. Shriram General precedent legally binds 100% reimbursement.'
      },
      {
        title: 'Surveyor Challenge Notice Formatted',
        telemetry: 'Drafting formal revision demand letter with IRDAI Surveyor Disciplinary citation ...',
        durationMs: 700,
        status: 'completed',
        detail: 'Deduction reversal notice compiled with 94% win probability.'
      }
    ]
  },
  {
    id: 'case-care-sia',
    case_title: 'Care Health — Proportional Room Rent Penalty Trap',
    patient_name: 'Sia',
    insurer_name: 'Care Health Insurance',
    domain: 'health',
    claim_amount: 320000,
    formatted_amount: '₹1,80,000 Slashed',
    denial_code: 'Clause 2.1 (Room Rent Associated Proportional Deduction)',
    alleged_reason: 'Patient selected Deluxe Room (₹8,000/day) over ₹5,000/day cap; insurer slashed all associated surgeon and OT fees.',
    expected_verdict: 'Overturned under IRDAI Sub-Limit Transparency Mandate',
    win_probability: 89,
    key_statute: 'IRDAI Master Circular 2024 (Section 14) & Consumer Protection Act 2019',
    smoking_gun: {
      title: 'Untenable Multiplier Penalty on Non-Room Items',
      source: 'Max Super Speciality Hospital, New Delhi (Itemized Bill CLM-778120)',
      summary: 'Insurer penalized fixed OT and anaesthesia charges where hospital tariff did not vary by room type. IRDAI regulations prohibit proportional slashing of fixed-fee medical components.',
      clinical_citation: 'IRDAI/HLT/REG/CIR/2024 | Max Hospital Fixed OT Schedule Annexure B'
    },
    policy_shield: {
      clause: 'Clause 2.1 (Associated Medical Expenses Proportional Reduction)',
      protection_clause: 'IRDAI directives mandate that proportional deductions cannot apply to standalone surgical fees with uniform hospital pricing.'
    },
    steps: [
      {
        title: 'Disbursement Slip Forensic Audit',
        telemetry: 'Scanning Care Health Settlement Ref: CARE/SETTLE/2026/77810 ... Penalties identified',
        durationMs: 800,
        status: 'completed',
        detail: 'Gross hospital bill of ₹3,20,000 slashed to ₹1,40,000 due to room rent cascade.'
      },
      {
        title: 'Hospital Itemization Breakdown',
        telemetry: 'Cross-referencing Max Saket OT & Surgeon fee matrices ...',
        durationMs: 900,
        status: 'completed',
        detail: 'Hospital confirmed OT tariff is fixed regardless of whether patient is in General or Deluxe room.'
      },
      {
        title: 'Regulatory Transparency Audit',
        telemetry: 'Applying IRDAI 2024 Master Circular on unfair proportional deductions ...',
        durationMs: 950,
        status: 'completed',
        detail: 'SMOKING GUN FOUND: Unfair penalty applied to fixed fees; violates Consumer Protection Section 2(47).'
      },
      {
        title: 'Grievance Dossier & Ombudsman Packet',
        telemetry: 'Compiling 15-day statutory escalation with Ombudsman jurisdiction filing ...',
        durationMs: 700,
        status: 'completed',
        detail: 'Restitution appeal ready with 89% estimated recovery probability.'
      }
    ]
  }
];
