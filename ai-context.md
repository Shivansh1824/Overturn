# Overturn — AI Context & Project Specification

## 1. Project Identity
- **Project Name:** Overturn
- **Tagline:** Autonomous Health Insurance Denial Appeal & Pre-Auth Strategist
- **Competition:** WCC Launchpad 30 (We Code Coders) — 30-Hour National Hackathon
- **Primary Track:** 01 — AGENTIC AI (Systems where AI agents reason, plan, use tools, and complete useful work with proper human oversight)
- **Cross-Domain Impact:** 
  - Track 02 (Open Innovation — Healthcare Operations)
  - Track 03 (Everyday Automation — Documents, forms, disputes, and paperwork reconciliation)
- **Submission Deadline:** Mon 5 Oct 2026, 14:00 IST
- **Target Deliverables:**
  1. High-impact web application prototype (Vite + React 19 + TypeScript + Tailwind CSS + Lucide Icons + Framer Motion)
  2. Automated CI/CD pipeline via GitHub and Vercel (vercel.json)
  3. Pre-loaded real-world clinical denial test cases for zero-latency, crash-proof judge evaluation
  4. Dual-mode AI engine (Deterministic local evaluator + live LLM API bridge for custom uploads)

---

## 2. Problem Statement & Real-World Evidence
- **The Core Problem:** Over 20% of legitimate health insurance pre-authorizations and post-treatment claims are rejected by insurers using automated denial codes (e.g. "Not medically necessary", "No proof of conservative therapy", "Experimental procedure").
- **The Human Bottleneck:** 80% of these denials are legally overturnable on appeal. However, reading 90+ page Insurer Clinical Policy Bulletins (CPBs), cross-referencing patient charts, and drafting formal legal-medical appeal packages takes 4–6 hours per claim. Overwhelmed clinic billing staff and stressed patients simply abandon their claims.
- **The Overturn Solution:** An autonomous multi-step agent that ingests the denial letter, identifies the insurer's policy guideline, cross-audits the patient's medical records to extract the exact clinical proof the insurer ignored, and generates an audit-proof Appeal Dossier with physician sign-off.

---

## 3. Four-Stage Product Workflow
```
[Screen 1: Case Intake] 
  → Ingest Denial Letter + Patient Medical Records (or 1-click test scenario)
[Screen 2: Agent Thought Stream] 
  → Multi-step autonomous reasoning: Denial code extraction, guideline retrieval, clinical chart cross-audit
[Screen 3: Evidence Battle Board] 
  → Side-by-side comparison: Insurer Allegation vs The Smoking Gun Clinical Proof (Human-in-the-Loop review & sign-off)
[Screen 4: Appeal Dossier & Regulator Shield] 
  → Overturn Probability Meter, formal appeal letter with ICD-10/CPT citations, IRDAI 15-day statutory deadline watchdog, 1-click export
```

---

## 4. Architectural Blueprint & Tech Stack
- **Frontend:**
  - React 19 + Vite (lightning-fast builds, sub-2-second HMR)
  - TypeScript (strict typing for clinical claim schemas)
  - Tailwind CSS + Lucide Icons + Framer Motion (premium medical-grade UI, micro-animations)
- **Deployment & CI/CD:**
  - Vercel native deployment (vercel.json) with SPA rewrite rules
  - Git repository with GitHub Actions / Vercel auto-deploy on push
- **AI & Evaluation Engine:**
  - Dual-Mode Architecture:
    - *Mode A (Offline / Demo-Safe):* Structured, pre-verified clinical test cases (Spine MRI, Knee Arthroscopy, Diabetes CGM) that run instantly with 100% deterministic reliability during live judge evaluation.
    - *Mode B (Live LLM Bridge):* Integration for dynamic analysis of user-uploaded custom denial letters and clinical notes using Gemini / OpenRouter.

---

## 5. Engineering Principles
- **Surgical, Clean, Modular Code:** Keep individual files under 600 lines. Isolate domain components into single-responsibility modules.
- **Traceability:** Every claim in an appeal letter must cite exact page and paragraph numbers from the uploaded patient records.
- **Human-in-the-Loop Trust:** AI recommends and structures evidence, but a human clinician or patient must explicitly verify and authorize the appeal before export (scoring 10/10 on Responsible Design & Trust).
