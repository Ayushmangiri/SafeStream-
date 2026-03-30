import express from "express";
import { createPost,getFeed,getFlaggedPosts,updatePostStatus } from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";
import {isLoggedIn,isAdmin} from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/create", isLoggedIn, upload.single("image"), createPost);
router.get("/feed",isLoggedIn,  getFeed);


// admin routes
router.get("/moderation", isLoggedIn, isAdmin, getFlaggedPosts);
router.put("/moderate/:id", isLoggedIn, isAdmin, updatePostStatus);

export default router;