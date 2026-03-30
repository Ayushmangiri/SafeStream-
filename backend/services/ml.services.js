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