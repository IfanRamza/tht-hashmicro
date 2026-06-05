import { BaseModel, type ModelId } from "../BaseModel";
import { validateRequired } from "../../utils/validators";

export type ProductCategory = "electronics" | "office" | "service" | "general";

export class Product extends BaseModel {
  public constructor(
    id: ModelId,
    public name: string,
    public category: ProductCategory,
    public price: number,
    public stock: number,
  ) {
    validateRequired("name", name);
    validateRequired("category", category);

    if (price < 0) {
      throw new Error("Price cannot be below zero");
    }

    if (stock < 0) {
      throw new Error("Stock cannot be below zero");
    }

    super(id);
    this.name = name.trim();
    this.category = category;
    this.price = price;
    this.stock = stock;
  }

  isAvailable(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }

}
