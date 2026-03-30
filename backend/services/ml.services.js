/**
 * Calls the unified SafeStream AI Moderation Service
 * @param {string} text - The post content text
 * @param {string} imageUrl - The Cloudinary URL of the image
 * @returns {Promise<object>} The moderation results (SAFE or REVIEW)
 */


//when i actually integrate ml model then replace above by this
// import axios from "axios";

import axios from "axios";

export const moderateContent = async (text, imageUrl) => {
  try {
    const response = await axios.post("http://127.0.0.1:8001/moderate", {
      text: text || null,
      image_url: imageUrl || null,
    });

    return response.data;
  } catch (error) {
    console.log("ML Error:", error.message || error);

    // fallback (important)
    return {
      status: "REVIEW",
      reason: "Ai Service Fails here"
    };
  }
};