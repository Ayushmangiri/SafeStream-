import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { serverUrl } from "../main.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";

function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const {userData}=useSelector((state)=>state.user)

  // get user data
  useEffect(() => {
    const user = userData;
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  // update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await axios.put(`${serverUrl}/api/v1/users/updateProfile`,{ newEmail:email,newName:name },{ withCredentials: true });

      toast.success(res.data?.message || "Profile updated");

      // update localStorage
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/profile");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-yellow-400 hover:scale-110 transition"
          >
            <FaArrowLeft />
          </button>

          <h2 className="text-xl font-bold">
            Edit <span className="text-yellow-400">Profile</span>
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black border border-yellow-500/20 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black border border-yellow-500/20 focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;