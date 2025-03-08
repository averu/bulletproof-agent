import { AppProvider } from "./providers";
import { Todos } from "./features/todos/routes";
import Auth from "./routes/Auth";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import { useAuth } from "./features/users/stores/userAtoms";

function App() {
  const auth = useAuth();
  console.log("auth", auth);
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/todos/*"
            element={
              auth.isAuthenticated ? <Todos /> : <Navigate to="/auth/signin" />
            }
          />
          <Route
            path="/auth/*"
            element={auth.isAuthenticated ? <Navigate to="/todos" /> : <Auth />}
          />
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
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
