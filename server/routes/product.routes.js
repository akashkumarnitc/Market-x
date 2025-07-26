import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProduct,
  updateProductStatus,
} from "../controllers/product.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import { singleUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// public routes
router.get("/all", getAllProducts);
router.get("/:id", getProductById);

// private routes (authentication required)
router.post("/create", isAuthenticated, singleUpload, createProduct);
router.get("/my", isAuthenticated, getUserProducts);
router.put("/:id", isAuthenticated, updateProduct);
router.patch("/:id/status", isAuthenticated, updateProductStatus);

export default router;
