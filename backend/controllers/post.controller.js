import Post from "../model/Post.model.js";
import { checkText, checkImage } from "../services/ml.services.js"; //include here checkContent here


const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file?.path;



    //  validation
    if (!text && !image) {
      return res.status(400).json({
        message: "Post must contain text or image",
      });
    }

    console.log("Cloudinary URL:", image);
    console.log("Text content:", text);

    // it check ML checks
    const textResult = checkText(text);
    const imageResult = await checkImage(image);

    // for final status
    let status = "safe";

    if (textResult === "flagged" || imageResult === "flagged") {
      status = "flagged";
    }

    if (textResult === "rejected" || imageResult === "rejected") {
      return res.status(400).json({
        message: "Content not appropriate",
      });
    }

    // for save post
    const post = await Post.create({
      user: req.user?.id,
      text,
      image,
      status,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating post",
    });
  }
};

//replace above by this when i integrate ml model
// const createPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const image = req.file?.path;

//     if (!text && !image) {
//       return res.status(400).json({
//         message: "Post must contain text or image",
//       });
//     }

//     //  here we send to ml
//     const result = await checkContent(text, image);

//     console.log("ML Result:", result);

//     let status = "safe";

//     if (result.text === "flagged" || result.image === "flagged") {
//       status = "flagged";
//     }

//     if (result.text === "rejected" || result.image === "rejected") {
//       return res.status(400).json({
//         message: "Content not appropriate",
//       });
//     }

//     const post = await Post.create({
//       user: req.user.id,
//       text,
//       image,
//       status,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created",
//       post,
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error creating post",
//     });
//   }
// };

const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const posts = await Post.find({ status: "safe" })
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
    const posts = await Post.find({ status: "flagged" });

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
    const { action } = req.body;

    let update = {};

    if (action === "accept") {
      update.status = "safe";
    } else if (action === "delete") {
      await Post.findByIdAndDelete(id);

      return res.json({
        message: "Post deleted",
      });
    } else {
      return res.status(400).json({
        message: "Invalid action",
      });
    }

    const post = await Post.findByIdAndUpdate(id, update, { new: true });

    res.json({
      message: "Post approved",
      post,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error moderating post",
    });
  }
};

export { createPost, getFeed, getFlaggedPosts, updatePostStatus };