import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Input } from "../../../components/Form/Input";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-sm mx-auto">
      <h2 className="text-xl text-gray-900 text-center font-bold mb-4">
        Sign In
      </h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignIn}>
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          required
        />
        <Input
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
        <button type="submit" disabled={loading} className="mt-4 w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
