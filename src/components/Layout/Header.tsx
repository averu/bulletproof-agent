import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";
import { authState } from "../../features/users/stores/userAtoms";

const Header = () => {
  const { user } = useAtomValue(authState);

  return (
    <header className="fixed top-0 left-0 w-full p-4 bg-gray-100 flex justify-between z-50">
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        {user ? (
          <span>Logged in as {user.name}</span>
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
