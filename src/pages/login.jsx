import { useState } from "react";
import { serverUrl } from "../main.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${serverUrl}/api/v1/users/login`,{ email, password },{ withCredentials: true });

      const data = result.data;
      console.log(data);

      toast.success(data?.message || "Login Successful ");

      setEmail("");
      setPassword("");

      navigate("/"); // redirect after login

    } catch (error) {
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-black via-gray-900 to-yellow-900 text-white p-10">
          
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              SafeStream <span className="text-yellow-400">Platform</span>
            </h1>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Welcome <br />
              <span className="text-yellow-400">back.</span>
            </h2>
            <p className="mt-4 text-gray-300">
              Login to continue your safe streaming experience.
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login to your account
          </h2>
          <p className="text-gray-500 mb-6">
            Welcome back to SafeStream
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500 text-sm"
                >
                  {showPassword ? <IoIosEye className="size-6"/> : <IoMdEyeOff className="size-6"/>}
                </span>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <span
              className="text-yellow-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;