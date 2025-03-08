import { AppProvider } from "./providers";
import { Todos } from "./features/todos/routes";
import Auth from "./routes/Auth";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthStatus from "./features/users/components/AuthStatus";
import Header from "./components/Layout/Header";
import { useAtom } from "jotai";
import { authState } from "./features/users/stores/userAtoms";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { getUserFromSession } from "./features/users/utils/user";

function App() {
  const [auth, setAuth] = useAtom(authState);

  useEffect(() => {
    const getSession = async () => {
      const user = await getUserFromSession();
      if (user) {
        setAuth({ isAuthenticated: true, user });
      } else {
        setAuth({ isAuthenticated: false, user: null });
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const user = await getUserFromSession();
          if (user) {
            setAuth({ isAuthenticated: true, user });
          }
        } else if (event === "SIGNED_OUT") {
          setAuth({ isAuthenticated: false, user: null });
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setAuth]);

  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/todos/*" element={<Todos />} />
          <Route path="/auth/*" element={<Auth />} />
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                <Navigate to="/todos" />
              ) : (
                <Navigate to="/auth/signin" />
              )
            }
          />
        </Routes>
        <AuthStatus />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
