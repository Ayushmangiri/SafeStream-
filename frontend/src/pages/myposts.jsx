import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import getCurrentUser from "../customeHooks/getCurrentUser";

function MyPosts() {
  const navigate = useNavigate();

  // Redux data
  const {userData, allPosts} = useSelector((state) => state.user);
  
    getCurrentUser();

  // ✅ FILTER LOGIC (IMPORTANT)
const myPosts = allPosts.filter(
    (post) => post.user?._id === userData?._id
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">
          My <span className="text-yellow-400">Posts</span>
        </h1>

        <button
          onClick={() => navigate("/create-post")}
          className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold hover:scale-105 transition"
        >
          + Create Post
        </button>
      </div>

      {/* EMPTY STATE */}
      {myPosts?.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No posts found 🚀
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {myPosts?.map((post) => (
            <div
              key={post._id}
              className="bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-5 
              shadow-[0_0_20px_rgba(255,215,0,0.1)] 
              hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] 
              hover:-translate-y-1 transition-all duration-300"
            >
              
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                
                {/* USER */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold">
                    {userData?.name?.charAt(0)}
                  </div>

                  <h3 className="text-yellow-400 font-semibold">
                    {userData?.name || "You"}
                  </h3>
                </div>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    post.status === "safe"
                      ? "bg-green-500/20 text-green-400"
                      : post.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {post.status === "safe"
                    ? "Safe"
                    : post.status === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>

              {/* TEXT */}
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                {post.text}
              </p>

              {/* IMAGE */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full max-h-80 object-cover rounded-xl border border-yellow-500/20 mb-3"
                />
              )}

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-3">
                
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </span>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPosts;