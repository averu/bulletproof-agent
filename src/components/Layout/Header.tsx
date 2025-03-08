import { Link } from "react-router-dom";
import { useAuth } from "../../features/users/stores/userAtoms";
import { supabase } from "../../lib/supabase";

const Header = () => {
  const auth = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full p-4 bg-gray-100 flex justify-between z-50">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        {auth.isAuthenticated ? (
          <>
            <span className="text-gray-700 mr-4 font-bold">
              Logged in as {auth.user?.name}
            </span>
            <Link
              to="#"
              className="mr-4"
              onClick={(event) => {
                event.preventDefault();
                supabase.auth.signOut();
              }}
            >
              Sign Out
            </Link>
          </>
        ) : (
          <>
            <Link to="/auth/signin" className="mr-4">
              Sign In
            </Link>
            <Link to="/auth/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
