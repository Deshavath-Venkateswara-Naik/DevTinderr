import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  // Function to fetch feed data
  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      // TODO: handle error
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return;

  if (feed.length <= 0)
    return (
      <h1 className="flex justify-center my-10 text-gray-400 text-xl font-semibold">
        🚫 No new users found!
      </h1>
    );

  return (
    feed && (
      <div className="flex flex-col items-center my-10 px-4">
        {/* Section Heading */}
        <h1 className="text-3xl font-bold text-white mb-8">
          🔥 New People You May Know
        </h1>

        {/* Animated Card */}
        <div className="animate-fadeInUp">
          <UserCard user={feed[0]} />
        </div>
      </div>
    )
  );
};

export default Feed;
