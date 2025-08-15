import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills,
    location,
  } = user;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-300 w-80 md:w-96 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 rounded-xl overflow-hidden">
      {/* Profile Image */}
      <figure className="bg-gray-800">
        <img
          src={photoUrl}
          alt="User"
          className="w-full h-64 object-cover"
        />
      </figure>

      {/* Profile Info */}
      <div className="card-body text-gray-200">
        <h2 className="card-title text-xl font-bold">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm text-gray-400">{`${age}, ${gender}`}</p>
        )}
        {location && (
          <p className="text-sm text-gray-400">
            📍 <span className="text-gray-300">{location}</span>
          </p>
        )}

        {about && <p className="mt-2 text-gray-300 text-sm">{about}</p>}

        {skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="badge badge-outline border-gray-500 text-gray-300 px-2 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="card-actions justify-center mt-6 gap-4">
          <button
            className="btn btn-sm btn-error px-6"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={loading}
          >
            Ignore
          </button>
          <button
            className="btn btn-sm btn-success px-6"
            onClick={() => handleSendRequest("interested", _id)}
            disabled={loading}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
