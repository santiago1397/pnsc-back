import { Router } from "express";
import {
    login,
    logout,
    register,
    verify,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", verifyToken, register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password/", resetPassword)
router.get("/verify", verify);

export default router;