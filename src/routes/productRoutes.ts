import { Router } from "express";
import { productController } from "../controllers/ProductController";

export const productRoutes = Router();

productRoutes.get("/", productController.index);
productRoutes.get("/create", productController.create);
productRoutes.post("/", productController.store);
productRoutes.get("/:id/edit", productController.edit);
productRoutes.post("/:id/update", productController.update);
productRoutes.post("/:id/delete", productController.destroy);
