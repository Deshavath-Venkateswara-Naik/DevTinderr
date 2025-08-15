import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Fetching requests failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;

  if (!requests || requests.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-2xl font-semibold text-gray-300 bg-base-300 px-6 py-3 rounded-lg shadow-lg border border-gray-700">
          🚫 No Connection Requests Found
        </p>
        <p className="text-gray-400 mt-2">
          You’ll see incoming requests here when someone connects with you.
        </p>
      </div>
    );

  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl text-blue-300 mb-8">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={_id}
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 mx-auto max-w-4xl shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover border border-gray-400"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 flex-1">
              <h2 className="font-semibold text-xl text-white">
                {firstName + " " + lastName}
              </h2>
              {age && gender && (
                <p className="text-gray-400">{age + ", " + gender}</p>
              )}
              <p className="text-gray-300">{about}</p>
            </div>
            <div>
              <button
                className="btn btn-error mx-2 text-white"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-success mx-2 text-white"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
