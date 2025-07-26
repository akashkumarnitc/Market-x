import express from "express";
import {
  checkUser,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { singleUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// public routes
router.post("/register", singleUpload, register);
router.post("/login", login);

// private routes
router.post("/logout", isAuthenticated, logout);
router.get("/check", isAuthenticated, checkUser);
router.put("/update-profile", isAuthenticated, singleUpload, updateProfile);

export default router;
