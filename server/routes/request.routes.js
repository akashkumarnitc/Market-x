import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";
import {
  acceptRequest,
  cancelRequest,
  createPurchaseRequest,
  getRequestsForSeller,
} from "../controllers/request.controller.js";

const router = express.Router();

// private (seller only) routes
router.get("/seller", isAuthenticated, getRequestsForSeller);
router.patch("/:requestId/accept", isAuthenticated, acceptRequest);

// private (buyer only) routes
router.post("/:productId", isAuthenticated, createPurchaseRequest);
router.patch("/:requestId/cancel", isAuthenticated, cancelRequest);

export default router;
