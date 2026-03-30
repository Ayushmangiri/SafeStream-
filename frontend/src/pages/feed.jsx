import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllPosts } from "../redux/userSlice.js";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userData,allPosts}=useSelector((state)=>state.user)

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${serverUrl}/api/v1/posts/feed`, {withCredentials: true,});

      dispatch(setAllPosts(res.data.posts || []))

      console.log(res.data);

      setPosts(res.data.posts || []);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      
      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">
          SafeStream <span className="text-yellow-400">Feed</span>
        </h1>

        {userData.role == "user" ? <button
          onClick={() => navigate("/create-post")}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          + Create Post
        </button> : <button
          onClick={() => navigate("/moderator")}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          Moderator Panel
        </button>}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-yellow-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts available</div>
      ) : (
        
        <div className="max-w-4xl mx-auto space-y-6">
          
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition"
            >
              
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-yellow-400 font-semibold">
                  {post.user?.name || "Anonymous"}
                </h3>

                {/* STATUS BADGE */}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    post.status === "safe"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {post.status === "safe" ? "Safe" : "Flagged"}
                </span>
              </div>

              {/* TEXT */}
              <p className="text-gray-300 mb-3">{post.text}</p>

              {/* IMAGE */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full max-h-96 object-cover rounded-xl border border-yellow-500/20"
                />
              )}

              {/* FOOTER */}
              <div className="text-xs text-gray-500 mt-3">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;