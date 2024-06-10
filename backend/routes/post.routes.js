import { Router } from "express";
import { protectedRoute } from "../middleware/protectRoute.middleware.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  likeUnlikePost,
  getLikedPost,
  getFollowingPost,
  getUserPost,
} from "../controllers/post.controller.js";

const router = Router();
// Get Methods
router.get("/all", protectedRoute, getAllPosts);
router.get("/likes/:id", protectedRoute, getLikedPost);
router.get("/following", protectedRoute, getFollowingPost);
router.get("/user/:username", protectedRoute, getUserPost);
// Post Methods
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentOnPost);
// Delete Method
router.delete("/:id", protectedRoute, deletePost);

export default router;
