import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <div className="min-h-screen bg-base-300 py-10 px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Your Profile
        </h1>
        <div className="max-w-4xl mx-auto bg-base-100 rounded-xl shadow-xl p-6 text-gray-200">
          <EditProfile user={user} />
        </div>
      </div>
    )
  );
};

export default Profile;
