import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  // Handle SignUp
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center my-10">
      {/* Glassmorphic Card */}
      <div className="card bg-base-300 bg-opacity-80 w-96 shadow-2xl border border-primary rounded-2xl backdrop-blur-md hover:scale-105 transition-transform duration-300">
        <div className="card-body">
          {/* Title */}
          <h2 className="card-title justify-center text-3xl font-extrabold text-primary">
            {isLoginForm ? "Welcome Back" : "Create Account"}
          </h2>

          {/* Form Fields */}
          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text font-semibold">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="John"
                    className="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-primary"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Doe"
                    className="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-primary"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </>
            )}

            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text font-semibold">Email ID:</span>
              </div>
              <input
                type="email"
                value={emailId}
                placeholder="example@mail.com"
                className="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-primary"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text font-semibold">Password</span>
              </div>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                className="input input-bordered w-full max-w-xs focus:ring-2 focus:ring-primary"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          {/* Submit Button */}
          <div className="card-actions justify-center m-2">
            <button
              className="btn btn-primary w-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          {/* Switch Form Link */}
          <p
            className="m-auto cursor-pointer py-2 text-primary font-medium hover:underline"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Sign up here"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
