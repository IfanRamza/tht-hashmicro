import { Router } from "express";
import { authController } from "../controllers/AuthController";

export const authRoutes = Router();

authRoutes.get("/login", authController.showLogin);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);
