import { NotFoundError } from "../errors";
import { Product, type ModelId, type ProductCategory } from "../models";
import { productRepository } from "../repositories/ProductRepository";
import { createUuidV7 } from "../utils/uuid";

export type CreateProductInput = {
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
};

export type UpdateProductInput = CreateProductInput;

type ProductRepositoryPort = {
  findAll(): Product[];
  findById(id: ModelId): Product | undefined;
  create(product: Product): Product;
  update(id: ModelId, updater: (product: Product) => void): Product | undefined;
  delete(id: ModelId): boolean;
};

type ProductServiceDependencies = {
  productRepository: ProductRepositoryPort;
  createId: typeof createUuidV7;
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "electronics",
  "office",
  "service",
  "general",
];

export function createProductService(
  dependencies: ProductServiceDependencies,
) {
  const { productRepository, createId } = dependencies;

  return {
    listProducts(): Product[] {
      return productRepository.findAll();
    },

    getProduct(id: string): Product {
      const product = productRepository.findById(id);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      return product;
    },

    createProduct(input: CreateProductInput): Product {
      return productRepository.create(
        new Product(
          createId(),
          input.name,
          input.category,
          input.price,
          input.stock,
        ),
      );
    },

    updateProduct(id: string, input: UpdateProductInput): Product | undefined {
      return productRepository.update(id, (product) => {
        product.name = input.name.trim();
        product.category = input.category;
        product.price = input.price;
        product.stock = input.stock;
      });
    },

    deleteProduct(id: string): boolean {
      return productRepository.delete(id);
    },
  };
}

export type ProductService = ReturnType<typeof createProductService>;

export const productService = createProductService({
  productRepository,
  createId: createUuidV7,
});
