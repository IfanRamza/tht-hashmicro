import type { Request, Response } from "express";
import type { ProductCategory } from "../models";
import {
  PRODUCT_CATEGORIES,
  productService,
  type ProductService,
} from "../services/ProductService";

type ProductControllerDependencies = {
  productService: ProductService;
};

export function createProductController(
  dependencies: ProductControllerDependencies,
) {
  const { productService } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("products/index", {
        title: "Products",
        products: productService.listProducts(),
      });
    },

    create(_req: Request, res: Response): void {
      res.render("products/form", {
        title: "Create Product",
        product: null,
        categories: PRODUCT_CATEGORIES,
        action: "/products",
      });
    },

    store(req: Request, res: Response): void {
      const { name, category, price, stock } = req.body as Record<string, string>;
      productService.createProduct({
        name,
        category: category as ProductCategory,
        price: Number(price),
        stock: Number(stock),
      });

      res.redirect("/products");
    },

    edit(req: Request, res: Response): void {
      const product = productService.getProduct(String(req.params.id));

      res.render("products/form", {
        title: "Edit Product",
        product,
        categories: PRODUCT_CATEGORIES,
        action: `/products/${product.id}/update`,
      });
    },

    update(req: Request, res: Response): void {
      const { name, category, price, stock } = req.body as Record<string, string>;

      productService.updateProduct(String(req.params.id), {
        name,
        category: category as ProductCategory,
        price: Number(price),
        stock: Number(stock),
      });

      res.redirect("/products");
    },

    destroy(req: Request, res: Response): void {
      productService.deleteProduct(String(req.params.id));
      res.redirect("/products");
    },
  };
}

export const productController = createProductController({
  productService,
});
