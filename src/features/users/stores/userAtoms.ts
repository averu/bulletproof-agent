import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { User } from "../types/user";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const usersState = atom<User[]>([]);

// authStateにuser情報を追加
export const authState = atomWithStorage<
  { isAuthenticated: boolean; user?: User | null }
>("authState", {
  isAuthenticated: false,
  user: null,
});

export const useAuth = () => {
  const [auth, setAuth] = useAtom(authState);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthState changed:", _event, session);
      setAuth({
        isAuthenticated: !!session,
        user: session?.user
          ? {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.displayName || "",
          }
          : null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth]);
  return auth;
};
