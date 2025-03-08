import { createClient } from "@supabase/supabase-js";

// Supabase プロジェクトの URL と anon キーを環境変数から取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase クライアントを初期化
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
