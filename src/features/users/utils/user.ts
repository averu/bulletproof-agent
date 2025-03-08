import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "../types/user";
import { supabase } from "@/lib/supabase";

export const convertSupabaseUserToUser = (
  supabaseUser: SupabaseUser
): User | null => {
  if (!supabaseUser) {
    return null;
  }
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || "",
  };
};

// Supabaseのセッションからユーザーデータを取得し、User型に変換
export const getUserFromSession = async (): Promise<User | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    return null;
  }

  if (!session?.user) {
    return null;
  }

  return convertSupabaseUserToUser(session.user);
};