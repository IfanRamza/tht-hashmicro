import { db } from "../database/memory";
import { Product } from "../models/product/Product";
import { BaseRepository } from "./BaseRepository";

export const productRepository = new BaseRepository<Product>(db.products);
