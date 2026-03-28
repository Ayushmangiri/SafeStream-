import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav from "../component/Nav.jsx";


function Home() {
  const navigate = useNavigate();

  const {userData}=useSelector((state)=>state.user);

  return (
    <div className="bg-black text-white min-h-screen">
      
      {/* NAVBAR */}
      <Nav/>
      {/* <nav className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          SafeStream <span className="text-yellow-400">Platform</span>
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-black transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold hover:scale-105 transition"
          >
            Sign Up
          </button>
        </div>
      </nav> */}

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16">
        
        {/* LEFT */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            AI-Powered <br />
            <span className="text-yellow-400">Content Moderation</span>
          </h1>

          <p className="text-gray-400 text-lg">
            SafeStream helps detect toxic content, NSFW images, and misinformation 
            in real-time using advanced AI models.
          </p>

          <div className="space-x-4">
            <button
              onClick={() => navigate("/feed")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold hover:scale-105 transition"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Live Moderation Preview
            </h3>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-800 p-3 rounded-lg">
                "This is a clean post" ✅ Safe
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                "Hate speech detected..." ❌ Flagged
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                Image Upload → NSFW ⚠️ Warning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 md:px-16 py-16 bg-gradient-to-b from-black to-gray-900">
        
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-black border border-yellow-500/20 rounded-xl p-6 hover:shadow-yellow-500/20 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">
              Toxicity Detection
            </h3>
            <p className="text-gray-400">
              Detect abusive or harmful text using AI models instantly.
            </p>
          </div>

          <div className="bg-black border border-yellow-500/20 rounded-xl p-6 hover:shadow-yellow-500/20 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">
              NSFW Image Detection
            </h3>
            <p className="text-gray-400">
              Automatically classify images as safe or inappropriate.
            </p>
          </div>

          <div className="bg-black border border-yellow-500/20 rounded-xl p-6 hover:shadow-yellow-500/20 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">
              Smart Moderation
            </h3>
            <p className="text-gray-400">
              Dashboard for moderators to approve or reject flagged content.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 border-t border-gray-800 text-gray-500">
        © 2026 SafeStream. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;