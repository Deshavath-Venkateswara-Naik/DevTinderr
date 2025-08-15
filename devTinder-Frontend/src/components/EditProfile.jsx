import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  // State variables for form fields
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [location, setLocation] = useState(user.location || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  // Function to save profile
  const saveProfile = async () => {
    // Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          location,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10 flex-col lg:flex-row gap-10">
        {/* Edit Profile Form */}
        <div className="flex justify-center mx-10">
          <div className="card bg-gradient-to-b from-gray-900 to-gray-800 w-96 shadow-2xl border border-gray-700 p-4 rounded-2xl">
            <div className="card-body">
              <h2 className="card-title justify-center text-white text-2xl font-bold mb-4">
                ✏️ Edit Profile
              </h2>

              {/* First Name */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    First Name:
                  </span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              {/* Last Name */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Last Name:
                  </span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              {/* Photo URL */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Photo URL:
                  </span>
                </div>
                <input
                  type="text"
                  value={photoUrl}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </label>

              {/* Age */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Age:
                  </span>
                </div>
                <input
                  type="text"
                  value={age}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>

              {/* Gender */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Gender:
                  </span>
                </div>
                <input
                  type="text"
                  value={gender}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>

              {/* About */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    About:
                  </span>
                </div>
                <input
                  type="text"
                  value={about}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </label>

              {/* Location */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Location:
                  </span>
                </div>
                <input
                  type="text"
                  value={location}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>

              {/* Skills */}
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-gray-300 font-semibold">
                    Skills (comma separated):
                  </span>
                </div>
                <input
                  type="text"
                  value={skills}
                  className="input input-bordered w-full max-w-xs bg-gray-800 border-gray-600 text-white focus:border-primary focus:ring focus:ring-primary/30 transition-all rounded-lg"
                  onChange={(e) => setSkills(e.target.value)}
                />
              </label>

              {/* Error Message */}
              <p className="text-red-400">{error}</p>

              {/* Save Button */}
              <div className="card-actions justify-center m-2">
                <button
                  className="bg-primary hover:bg-primary-focus text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  onClick={saveProfile}
                >
                  💾 Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <UserCard
          user={{
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
            location,
            skills: skills.split(",").map((s) => s.trim()),
          }}
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center animate-bounce">
          <div className="alert alert-success bg-green-600 text-white rounded-full shadow-lg px-6 py-3">
            <span>✅ Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
