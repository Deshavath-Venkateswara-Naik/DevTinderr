import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((store) => store.user);

  return (
    <header className="bg-base-100 text-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80">
        Devinder
      </Link>
      <nav className="flex gap-4 items-center">
        <Link to="/" className="hover:text-primary">Feed</Link>
        <Link to="/connections" className="hover:text-primary">Connections</Link>
        <Link to="/requests" className="hover:text-primary">Requests</Link>
        <Link to="/search" className="hover:text-primary">Search</Link>
        {user ? (
          <Link to="/profile" className="hover:text-primary">Profile</Link>
        ) : (
          <Link to="/login" className="hover:text-primary">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
