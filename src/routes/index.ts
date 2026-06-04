import { Router } from "express";
import { characterCheckerRoutes } from "./characterCheckerRoutes";
import { customerRoutes } from "./customerRoutes";
import { orderRoutes } from "./orderRoutes";
import { productRoutes } from "./productRoutes";

export const routes = Router();

routes.use("/products", productRoutes);
routes.use("/customers", customerRoutes);
routes.use("/orders", orderRoutes);
routes.use("/character-checker", characterCheckerRoutes);
