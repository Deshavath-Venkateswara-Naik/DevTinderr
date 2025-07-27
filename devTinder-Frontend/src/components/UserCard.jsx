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
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="User" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>

        {age && gender && <p>{`${age}, ${gender}`}</p>}
        {location && <p><strong>Location:</strong> {location}</p>}
        <p>{about}</p>

        {skills && (
          <p>
            <strong>Skills:</strong> {skills}
          </p>
        )}

        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
            disabled={loading}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
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
