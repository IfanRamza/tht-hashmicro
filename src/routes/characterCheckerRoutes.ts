import { Router } from "express";
import { characterCheckerController } from "../controllers/CharacterCheckerController";

export const characterCheckerRoutes = Router();

characterCheckerRoutes.get("/", characterCheckerController.index);
characterCheckerRoutes.post("/", characterCheckerController.check);
