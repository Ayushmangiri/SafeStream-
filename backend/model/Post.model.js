import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["safe", "flagged", "rejected"],
      default: "safe",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);