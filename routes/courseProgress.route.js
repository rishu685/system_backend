import express from "express"
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
    getUserCourseProgress,
    updateLectureProgress,
    markCourseAsCompleted,
    resetCourseProgress
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

// Get course progress
router.get("/:courseId", isAuthenticated, getUserCourseProgress);

// Update lecture progress
router.patch("/:courseId/lectures/:lectureId", isAuthenticated, updateLectureProgress);

// Mark course as completed
router.patch("/:courseId/complete", isAuthenticated, markCourseAsCompleted);

// Reset course progress
router.patch("/:courseId/reset", isAuthenticated, resetCourseProgress);

export default router;