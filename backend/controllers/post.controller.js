import Post from "../model/Post.model.js";
import { checkText, checkImage } from "../services/ml.services.js"; //include here checkContent here
import { moderateContent } from "../services/ml.services.js"; //include here moderateContent here


// const createPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const image = req.file?.path;

//     console.log("Image URL:", image);

//     //  validation
//     if (!text && !image) {
//       return res.status(400).json({
//         message: "Post must contain text or image",
//       });
//     }

//     console.log("Cloudinary URL:", image);
//     console.log("Text content:", text);

//     // it check ML checks
//     const textResult = checkText(text);
//     const imageResult = await checkImage(image);

//     // for final status
//     let status = "safe";

//     if (textResult === "flagged" || imageResult === "flagged") {
//       status = "flagged";
//     }

//     if (textResult === "rejected" || imageResult === "rejected") {
//       return res.status(400).json({
//         message: "Content not appropriate",
//       });
//     }

//     // for save post
//     const post = await Post.create({
//       user: req.user?.id,
//       text,
//       image,
//       status,
//     });

//     res.status(201).json({
//       message: "Post created successfully",
//       post,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error creating post",
//     });
//   }
// };

//replace above by this when i integrate ml model

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file?.path;

    console.log("Image URL:", image);

    if (!text && !image) {
      return res.status(400).json({
        message: "Post must contain text or image",
      });
    }

    //  Send to ML
    const moderation = await moderateContent(text, image);
    console.log("ML Result:", moderation);

    let status = "safe";

    if (moderation.status === "REVIEW") {
      status = "flagged";
    }

    if (moderation.status === "REJECTED") {
      return res.status(400).json({
        message: "Content not appropriate",
      });
    }

    //  Save post ALWAYS (except rejected)
    const post = await Post.create({
      user: req.user.id,
      text,
      image,
      status,
    });

    res.status(201).json({
      success: true,
      message:
        status === "safe"
          ? "Post published"
          : "Post sent for review",
      post,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating post",
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