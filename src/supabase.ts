import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://amwzxtvqezooxcheosnn.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1p-genQudnJSFw3geRHD9g_thtsoB-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
