import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../main.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ModeratorDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // fetch flagged posts
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${serverUrl}/api/v1/posts/moderation`,{ withCredentials: true });

      setPosts(res.data.posts || []);
    } catch (error) {
      toast.error("Failed to load flagged posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // approve post
  const handleApprove = async (id) => {
    try {
      await axios.put(`${serverUrl}/api/v1/posts/moderate/${id}`,{status:"safe"},{ withCredentials: true });

      toast.success("Post Approved ✅");
      fetchPosts();
    } catch (error) {
      toast.error("Approve failed");
    }
  };

  // reject post
  const handleReject = async (id) => {
    try {
      await axios.put(`${serverUrl}/api/v1/posts/moderate/${id}`,{status:"rejected"},{ withCredentials: true });

      toast.success("Post Rejected ❌");
      fetchPosts();
    } catch (error) {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      
      {/* NAVBAR */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">
          Moderator <span className="text-yellow-400">Dashboard</span>
        </h1>

        <button
          onClick={() => navigate("/feed")}
          className="px-4 py-2 border border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-black transition"
        >
          Back to Feed
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center text-yellow-400">
          Loading flagged posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">
          No flagged posts 🚀
        </div>
      ) : (
        
        <div className="max-w-4xl mx-auto space-y-6">
          
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)] transition"
            >
              
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold">
                    {post.user?.name?.charAt(0)}
                  </div>
                  <h3 className="text-yellow-400 font-semibold">
                    {post.user?.name || "User"}
                  </h3>
                </div>

                {/* FLAGGED BADGE */}
                <span className="px-3 py-1 text-xs rounded-full font-semibold bg-red-500/20 text-red-400">
                  Flagged
                </span>
              </div>

              {/* TEXT */}
              <p className="text-gray-300 mb-3">{post.text}</p>

              {/* IMAGE */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full max-h-80 object-cover rounded-xl border border-yellow-500/20 mb-3"
                />
              )}

              {/* FLAG REASON */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm mb-4">
                Reason:{" "}
                <span className="text-yellow-400">
                  {post.reason || "Toxic / NSFW detected"}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4">
                
                <button
                  onClick={() => handleApprove(post._id)}
                  className="flex-1 py-2 bg-green-500 text-black rounded-lg font-semibold hover:scale-105 transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(post._id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg font-semibold hover:scale-105 transition"
                >
                  Reject
                </button>

              </div>

              {/* DATE */}
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

export default ModeratorDashboard;