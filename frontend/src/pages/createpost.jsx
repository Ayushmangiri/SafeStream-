import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { serverUrl } from "../main.jsx";
import { FaImage, FaTrash } from "react-icons/fa";

function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return toast.error("Text content is required");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      if (image) formData.append("image", image);

      const res = await axios.post(`${serverUrl}/api/v1/posts/create`,formData,{ withCredentials: true });

      toast.success(res.data?.message || "Post Created");

      setText("");
      setImage(null);
      setPreview(null);

      navigate("/feed"); // go back to home or feed

    } catch (error) {
      toast.error(error?.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,215,0,0.1)]">

      <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">
         SafeStream <span className="text-yellow-400">Platform</span>
      </h1>

      <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold"
        onClick={()=>navigate('/feed')}
      >
         Feed
      </button>
   </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create <span className="text-yellow-400">Post</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TEXT AREA */}
          <div>
            <label className="text-sm text-gray-400">Your Content *</label>
            <textarea
              rows="5"
              placeholder="Write something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full mt-2 p-3 rounded-lg bg-black border border-yellow-500/20 focus:ring-2 focus:ring-yellow-500 outline-none"
            />

            <div className="text-right text-xs text-gray-500">
             {text.length}/500
            </div>
          </div>


          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-gray-400">Upload Image (optional)</label>

            {!preview ? (
              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-yellow-500/30 rounded-lg p-6 cursor-pointer hover:bg-yellow-500/10 transition">
                <FaImage className="text-yellow-400 text-3xl mb-2" />
                <span className="text-gray-400">Click to upload image</span>
                <input type="file" hidden onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative mt-3">
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-lg w-full h-60 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Content"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;