import { Router } from "express";
import { customerController } from "../controllers/CustomerController";

export const customerRoutes = Router();

customerRoutes.get("/", customerController.index);
customerRoutes.get("/create", customerController.create);
customerRoutes.post("/", customerController.store);
customerRoutes.get("/:id/edit", customerController.edit);
customerRoutes.post("/:id/update", customerController.update);
customerRoutes.post("/:id/delete", customerController.destroy);
