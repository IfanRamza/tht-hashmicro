import type { Request, Response } from "express";
import { NotFoundError } from "../errors";
import { Product, type ModelId, type ProductCategory } from "../models";
import { productRepository } from "../repositories/ProductRepository";
import { createUuidV7 } from "../utils/uuid";

type ProductRepositoryPort = {
  findAll(): Product[];
  findById(id: ModelId): Product | undefined;
  create(product: Product): Product;
  update(id: ModelId, updater: (product: Product) => void): Product | undefined;
  delete(id: ModelId): boolean;
};

const categories: ProductCategory[] = [
  "electronics",
  "office",
  "service",
  "general",
];

export function createProductController(repository: ProductRepositoryPort) {
  return {
  index(_req: Request, res: Response): void {
    res.render("products/index", {
      title: "Products",
      products: repository.findAll(),
    });
  },

  create(_req: Request, res: Response): void {
    res.render("products/form", {
      title: "Create Product",
      product: null,
      categories,
      action: "/products",
    });
  },

  store(req: Request, res: Response): void {
    const { name, category, price, stock } = req.body as Record<string, string>;
    const product = new Product(
      createUuidV7(),
      name,
      category as ProductCategory,
      Number(price),
      Number(stock),
    );

    repository.create(product);
    res.redirect("/products");
  },

  edit(req: Request, res: Response): void {
    const product = repository.findById(String(req.params.id));

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.render("products/form", {
      title: "Edit Product",
      product,
      categories,
      action: `/products/${product.id}/update`,
    });
  },

  update(req: Request, res: Response): void {
    const { name, category, price, stock } = req.body as Record<string, string>;

    repository.update(String(req.params.id), (product) => {
      product.name = name.trim();
      product.category = category as ProductCategory;
      product.price = Number(price);
      product.stock = Number(stock);
    });

    res.redirect("/products");
  },

  destroy(req: Request, res: Response): void {
    repository.delete(String(req.params.id));
    res.redirect("/products");
  },
};
}

export const productController = createProductController(productRepository);
