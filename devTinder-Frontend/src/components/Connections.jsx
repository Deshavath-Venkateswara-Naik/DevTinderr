import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;
  if (connections.length === 0)
    return (
      <h1 className="text-center text-gray-400 text-2xl my-10">
        No Connections Found
      </h1>
    );

  return (
    <div className="max-w-5xl mx-auto my-12 px-4">
      <h1 className="font-extrabold text-white text-4xl mb-8 text-center">
        Your Connections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center gap-6 p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl shadow-lg border border-gray-700 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <img
                alt="profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary shadow-md"
                src={photoUrl}
              />

              <div className="flex-1">
                <h2 className="font-bold text-2xl text-white">
                  {firstName} {lastName}
                </h2>
                {age && gender && (
                  <p className="text-gray-400 text-sm">
                    {age} • {gender}
                  </p>
                )}
                <p className="text-gray-300 mt-2 text-sm line-clamp-2">
                  {about || "No bio available"}
                </p>
              </div>

              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary px-6 py-2 rounded-full text-white font-semibold shadow-md hover:shadow-lg hover:bg-primary-focus transition-colors">
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
