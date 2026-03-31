import Post from "../model/Post.model.js";
import { moderateContent } from "../services/ml.services.js";


const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file?.path; 

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Post must contain either text or an image",
      });
    }

    const moderation = await moderateContent(text, image);
    
    const status = moderation.status === "REVIEW" ? "flagged" : "safe";
    const postTime = new Date().toLocaleString();

    if (status === "flagged") {
      console.log(`\x1b[31m[MODERATION ALERT] [${postTime}]: Post from user ${req.user.id} sent for manual review...\x1b[0m`);
    } else {
      console.log(`\x1b[32m [SAFE CONTENT] [${postTime}]: Post published immediately.\x1b[0m`);
    }

    const post = await Post.create({
      user: req.user.id,
      text,
      image,
      status,
      moderationResponse: moderation 
    });

    res.status(201).json({
      success: status === "safe", 
      message: status === "safe" 
        ? "Post published successfully!" 
        : "Post flagged and sent for moderation review.",
      post,
    });

  } catch (error) {
    console.error("[CREATE POST ERROR]:", error);
    res.status(500).json({
      success: false,
      message: "An internal error occurred while creating your post",
    });
  }
};

const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const posts = await Post.find({ status: "safe" }).populate("user")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching feed",
    });
  }
};

const getFlaggedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "flagged" }).populate("user");

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching flagged posts",
    });
  }
};
const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["safe", "flagged", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }
    const post = await Post.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      message: "Post updated",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
    });
  }
};

export { createPost, getFeed, getFlaggedPosts, updatePostStatus };