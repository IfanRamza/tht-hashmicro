import { Router } from "express";
import { orderController } from "../controllers/OrderController";

export const orderRoutes = Router();

orderRoutes.get("/", orderController.index);
orderRoutes.get("/create", orderController.create);
orderRoutes.post("/", orderController.store);
orderRoutes.post("/:id/mark-as-paid", orderController.markAsPaid);
orderRoutes.post("/:id/cancel", orderController.cancel);
orderRoutes.get("/:id", orderController.show);
orderRoutes.post("/:id/delete", orderController.destroy);
