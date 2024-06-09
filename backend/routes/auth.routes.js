import { Router } from "express";
import {
  signup,
  login,
  logout,
  getMe,
} from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectRoute.middleware.js";
const router = Router();

router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
export default router;
