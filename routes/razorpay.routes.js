import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/razorpay.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createRazorpayOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);

export default router;
