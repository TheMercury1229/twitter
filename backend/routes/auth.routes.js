import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/login", logout);
export default router;
