import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    user && (
      <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200 py-12 px-4">
        
        {/* Page Heading */}
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg mb-10 animate-fadeIn">
          Your Profile
        </h1>
        
        {/* Profile Card */}
        <div className="max-w-4xl mx-auto bg-base-100/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-gray-200 border border-gray-700 animate-slideUp">
          <EditProfile user={user} />
        </div>
      </div>
    )
  );
};

export default Profile;
