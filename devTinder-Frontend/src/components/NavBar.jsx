import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-gray-800 shadow-md border-b border-gray-200">
      <div className="navbar flex justify-between items-center px-6 py-3">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          👩‍💻 DevTinder
        </Link>

        {/* Right side - only show if user is logged in */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">
              Welcome, <span className="font-semibold">{user.firstName}</span>
            </span>

            {/* Avatar dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
              >
                <div className="w-10 rounded-full ring ring-gray-300 ring-offset-base-100 ring-offset-2">
                  <img alt="user" src={user.photoUrl} />
                </div>
              </div>

              {/* Dropdown menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-56 rounded-xl bg-gray-50 text-gray-800 shadow-lg border border-gray-200"
              >
                <li>
                  <Link to="/profile" className="justify-between hover:bg-gray-200 rounded-lg">
                    Profile
                    <span className="badge bg-blue-100 text-blue-700">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="hover:bg-gray-200 rounded-lg">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:bg-gray-200 rounded-lg">
                    Search
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="hover:bg-gray-200 rounded-lg">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="hover:bg-gray-200 rounded-lg">
                    Premium
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:bg-gray-200 rounded-lg">
                    Feed
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-100 text-red-600 rounded-lg"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
