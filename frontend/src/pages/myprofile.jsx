import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { useSelector } from "react-redux";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const {userData}=useSelector((state)=>state.user)

  useEffect(() => {
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          
          {/* Avatar */}
          <div className="w-20 h-20 bg-yellow-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mb-3">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-semibold text-yellow-400">
            {user.name}
          </h2>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        {/* USER INFO */}
        <div className="space-y-4">
          
          <div className="bg-black border border-yellow-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-yellow-400 font-medium">{user.name}</p>
          </div>

          <div className="bg-black border border-yellow-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-yellow-400 font-medium">{user.email}</p>
          </div>

          <div className="bg-black border border-yellow-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-500">Role</p>
            <p className="text-yellow-400 font-medium capitalize">
              {user.role}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 space-y-3">
          
          {/* Edit Profile */}
          <button
            onClick={() => navigate("/edit-profile")}
            className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold hover:scale-105 transition"
          >
            <FaUserEdit />
            Edit Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;