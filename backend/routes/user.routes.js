import express from "express";
import { registerUser,login,getMe,logoutUser,updateProfile,getAllUsers,deleteUserByAdmin } from "../controllers/user.controller.js";
import { isLoggedIn,isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logoutUser);
router.post("/updateProfile",isLoggedIn,updateProfile);
router.get("/admin/users", isLoggedIn, isAdmin, getAllUsers);
router.delete("/admin/users/:id", isLoggedIn, isAdmin, deleteUserByAdmin);

export default router;