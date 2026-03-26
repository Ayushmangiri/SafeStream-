import express from "express";
import { registerUser,login,getMe,logoutUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);

export default router;