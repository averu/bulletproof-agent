import { Routes, Route } from "react-router-dom";
import SignIn from "../features/users/components/SignIn";
import SignUp from "../features/users/components/SignUp";

function Auth() {
  return (
    <Routes>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
    </Routes>
  );
}

export default Auth;
