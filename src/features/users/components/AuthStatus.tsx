import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user", user);
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("onAuthStateChange", _event, session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {user ? (
        <>
          <p>Logged in as {user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <p>Not logged in</p>
          <Link to="/auth/signin">Sign In</Link>
          {" | "}
          <Link to="/auth/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
}

export default AuthStatus;
