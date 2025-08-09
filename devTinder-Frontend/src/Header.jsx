import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((store) => store.user);

  return (
    <header className="bg-black text-white shadow-lg p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide hover:text-gray-300 transition duration-300"
      >
        DevTinder
      </Link>

      {/* Navigation */}
      <nav className="flex gap-6 items-center text-sm font-medium">
        <Link to="/" className="hover:text-yellow-400 transition duration-300">
          Feed
        </Link>
        <Link
          to="/connections"
          className="hover:text-yellow-400 transition duration-300"
        >
          Connections
        </Link>
        <Link
          to="/requests"
          className="hover:text-yellow-400 transition duration-300"
        >
          Requests
        </Link>
        <Link
          to="/search"
          className="hover:text-yellow-400 transition duration-300"
        >
          Search
        </Link>
        {user ? (
          <Link
            to="/profile"
            className="hover:text-yellow-400 transition duration-300"
          >
            Profile
          </Link>
        ) : (
          <Link
            to="/login"
            className="hover:text-yellow-400 transition duration-300"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
