import type { ModelId } from "../BaseModel";
import { Customer } from "../person/Customer";
import { OrderItem } from "./OrderItem";
import { Transaction, type TransactionStatus } from "./Transaction";

export class Order extends Transaction {
  private static readonly TAX_RATE = 0.11;

  public constructor(
    id: ModelId,
    code: string,
    public customer: Customer,
    public items: OrderItem[] = [],
    status: TransactionStatus = "draft",
    transactionDate: Date = new Date(),
  ) {
    super(id, code, status, transactionDate);
    this.customer = customer;
    this.items = items;
  }

  getSubtotal(): number {
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getDiscount(): number {
    const subtotal = this.getSubtotal();
    return subtotal * this.getDiscountRate();
  }

  getDiscountRate(): number {
    return this.customer.getDiscountRate();
  }

  getTax(): number {
    return this.getTaxableAmount() * Order.TAX_RATE;
  }

  getTaxableAmount(): number {
    return this.getSubtotal() - this.getDiscount();
  }

  getGrandTotal(): number {
    return this.getSubtotal() - this.getDiscount() + this.getTax();
  }
}
