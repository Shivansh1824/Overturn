import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jvdsacdbafzudsbunwjq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'judge' | 'claimant' | 'provider';
  badge?: string;
}

// 1-Click Fast Track Judge Profiles
export const DEMO_PROFILES: Record<string, AuthUser> = {
  judge: {
    id: 'usr_judge_wcc30',
    email: 'judge.wcc30@hackathon.org',
    name: 'WCC Launchpad 30 Judge',
    role: 'judge',
    badge: 'Official Hackathon Evaluator',
  },
  provider: {
    id: 'usr_prov_apollo',
    email: 'dr.sharma@apollohospitals.org',
    name: 'Dr. Alok Sharma, MD',
    role: 'provider',
    badge: 'Chief Medical Officer / Billing Director',
  },
  claimant: {
    id: 'usr_pat_vikram',
    email: 'vikram.patient@gmail.com',
    name: 'Vikramaditya Sengupta',
    role: 'claimant',
    badge: 'Policyholder / Claimant',
  },
};
