import { useState } from "react";
import { serverUrl } from "../main.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);

  console.log(name,email,password);
  
  const handleSignUp = async (e)=>{
    e.preventDefault()
    setLoading(true);

    try {
      const result = await axios.post(`${serverUrl}/api/v1/users/register`, {name,email,password},{withCredentials:true})
      const data=result.data
      console.log(data);
      toast.success(data?.message);
      setLoading(false);

      setName("");
      setEmail("");
      setPassword("");
      navigate('/login')

    } catch (error) {
      toast.error(error?.response?.data?.message || "SignUp Error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* LEFT SIDE (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-black via-gray-900 to-yellow-900 text-white p-10">
          
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              SafeStream <span className="text-yellow-400">Platform</span>
            </h1>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Start your <br />
              <span className="text-yellow-400">journey today.</span>
            </h2>
            <p className="mt-4 text-gray-300">
              A clean and secure platform to manage your content and ensure safe streaming.
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create an account
          </h2>
          <p className="text-gray-500 mb-6">
            Join SafeStream to get started
          </p>

          <form className="space-y-5" onSubmit={handleSignUp}>
            
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                required
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="amansoni0228@gmail.com"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  required
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
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
              className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold hover:shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95 active:shadow-md"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-6 text-center">
            Already have an account?{" "}
            <span className="text-yellow-600 font-medium cursor-pointer hover:underline" onClick={()=>navigate('/login')}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;