export const checkText = (text) => {
  if (!text) return "safe";

  if (text.includes("bad")) return "flagged";

  return "safe";
};

export const checkImage = async (imageUrl) => {
  if (!imageUrl) return "safe";

  // dummy logic (replace later with API)
  if (Math.random() > 0.8) return "rejected";

  return "safe";
};


//when i actually integrate ml model then replace above by this
// import axios from "axios";

// import axios from "axios";

// export const moderateContent = async (text, imageUrl) => {
//   try {
//     const response = await axios.post("http://localhost:8000/moderate", {
//       text,
//       image: imageUrl,
//     });

//     return response.data;
//   } catch (error) {
//     console.log("ML Error:", error.message);

//     // fallback (important)
//     return { 
//       status:"review",
//       reason:"Ai Service Fails here"
//      };
//   }
// };