import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { Input } from "../../../components/Form/Input";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (user) {
      const { error: invokeError } = await supabase.functions.invoke(
        "user-sync",
        {
          body: {
            record: {
              id: user.id,
              email: user.email,
              name: displayName || "",
            },
          },
        }
      );

      if (invokeError) {
        setError(invokeError.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-sm mx-auto">
      <h2 className="text-xl text-gray-900 text-center font-bold mb-4">
        Sign Up
      </h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignUp}>
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
        <Input
          label="Display Name"
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDisplayName(e.target.value)
          }
          required
        />
        <button type="submit" disabled={loading} className="mt-4 w-full">
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
