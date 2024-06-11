import { Router } from "express";
import { protectedRoute } from "../middleware/protectRoute.middleware.js";
import {
  deleteNotification,
  deleteOneNotification,
  getNotification,
} from "../controllers/notification.controller.js";
const router = Router();

router.get("/", protectedRoute, getNotification);
router.delete("/", protectedRoute, deleteNotification);
router.delete("/:id", protectedRoute, deleteOneNotification);
export default router;
