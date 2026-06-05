import { BaseModel, type ModelId } from "../BaseModel";
import { Product } from "../product/Product";

export class OrderItem extends BaseModel {
  public constructor(
    id: ModelId,
    public product: Product,
    public quantity: number,
  ) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (!product.isAvailable(quantity)) {
      throw new Error("Product stock is not enough");
    }

    super(id);
    this.product = product;
    this.quantity = quantity;
  }

  getSubtotal(): number {
    return this.product.price * this.quantity;
  }
}
