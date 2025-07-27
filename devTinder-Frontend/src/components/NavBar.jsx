import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <header className="sticky top-0 z-50 bg-gray-100 text-gray-800 shadow-md">
      <div className="navbar flex justify-between items-center px-6 py-3">
        <Link
          to="/"
          className="text-2xl font-semibold text-gray-700 hover:text-blue-600"
        >
          👩‍💻 DevTinder
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              Welcome, {user.firstName}
            </span>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-gray-400 ring-offset-gray-100 ring-offset-2">
                  <img alt="user" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-52 rounded-md bg-gray-200 text-gray-800 shadow-md border border-gray-300"
              >
                <li>
                  <Link to="/profile" className="justify-between hover:bg-gray-300">
                    Profile
                    <span className="badge bg-blue-100 text-blue-700">New</span>
                  </Link>
                </li>
                <li><Link to="/connections" className="hover:bg-gray-300">Connections</Link></li>
                <li><Link to="/search" className="hover:bg-gray-300">Search</Link></li>
                <li><Link to="/requests" className="hover:bg-gray-300">Requests</Link></li>
                <li>
                  <a onClick={handleLogout} className="hover:bg-red-100 text-red-600">Logout</a>
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
