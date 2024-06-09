import { Router } from "express";
import { protectedRoute } from "../middleware/protectRoute.middleware.js";
import {
  followUnfollowUser,
  getSuggestedUser,
  getUserProfile,
  updateProfile,
} from "../controllers/user.controller.js";

const router = Router();
router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUser);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateProfile);

export default router;
