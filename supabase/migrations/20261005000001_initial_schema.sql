-- ====================================================================
-- Overturn: Core Database Schema Migration
-- Includes: profiles (Users), claim_cases (Appeals), policy_scans (X-Ray)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    full_name TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'patient', -- 'patient', 'clinician', 'billing_agent', 'admin'
    phone TEXT,
    organization TEXT,
    avatar_url TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone') THEN
    CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true);
  END IF;
END
$$;

-- Trigger for auto-syncing auth.users -> public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'patient')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CLAIM CASES TABLE (Disputes & Appeals)
CREATE TABLE IF NOT EXISTS public.claim_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    claim_id TEXT NOT NULL,
    policy_number TEXT,
    insurer_name TEXT NOT NULL,
    procedure_name TEXT,
    denial_code TEXT,
    denial_reason TEXT NOT NULL,
    claim_amount NUMERIC(12, 2) DEFAULT 0,
    denial_date DATE,
    status TEXT NOT NULL DEFAULT 'ready_for_review', -- 'draft', 'analyzing', 'ready_for_review', 'verified', 'dispatched'
    overturn_score INTEGER NOT NULL DEFAULT 85,
    confidence_rating TEXT NOT NULL DEFAULT 'High',
    overturn_confidence TEXT NOT NULL DEFAULT 'High',
    ai_evidence_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
    insurer_intelligence JSONB NOT NULL DEFAULT '{}'::jsonb,
    appeal_letter TEXT,
    appeal_letter_markdown TEXT,
    human_verified BOOLEAN NOT NULL DEFAULT false,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    statutory_deadline TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + interval '15 days'),
    irda_deadline TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + interval '15 days'),
    documents JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.claim_cases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'claim_cases' AND policyname = 'Allow public read access to claim_cases') THEN
    CREATE POLICY "Allow public read access to claim_cases" ON public.claim_cases FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'claim_cases' AND policyname = 'Allow public insert to claim_cases') THEN
    CREATE POLICY "Allow public insert to claim_cases" ON public.claim_cases FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'claim_cases' AND policyname = 'Allow public update to claim_cases') THEN
    CREATE POLICY "Allow public update to claim_cases" ON public.claim_cases FOR UPDATE USING (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_claim_cases_status ON public.claim_cases(status);
CREATE INDEX IF NOT EXISTS idx_claim_cases_claim_id ON public.claim_cases(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_cases_user_id ON public.claim_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_claim_cases_created_at ON public.claim_cases(created_at DESC);

-- 3. POLICY SCANS TABLE (Policy X-Ray & Pre-Auth Scanner)
CREATE TABLE IF NOT EXISTS public.policy_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    policy_name TEXT NOT NULL,
    policy_number TEXT,
    insurer_name TEXT NOT NULL,
    document_url TEXT,
    file_name TEXT,
    file_size NUMERIC,
    status TEXT NOT NULL DEFAULT 'completed', -- 'uploaded', 'analyzing', 'completed', 'failed'
    overall_score INTEGER DEFAULT 82, -- Policy Friendliness Index (0-100)
    summary TEXT,
    scan_result JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.policy_scans ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_scans' AND policyname = 'Allow public read access to policy_scans') THEN
    CREATE POLICY "Allow public read access to policy_scans" ON public.policy_scans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_scans' AND policyname = 'Allow public insert to policy_scans') THEN
    CREATE POLICY "Allow public insert to policy_scans" ON public.policy_scans FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'policy_scans' AND policyname = 'Allow public update to policy_scans') THEN
    CREATE POLICY "Allow public update to policy_scans" ON public.policy_scans FOR UPDATE USING (true);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_policy_scans_user_id ON public.policy_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_scans_status ON public.policy_scans(status);
