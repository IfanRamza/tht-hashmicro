import { validateRequired } from "../../utils/validators";
import type { ModelId } from "../BaseModel";
import { Person } from "./Person";

export type CustomerType = "regular" | "member" | "corporate";

export const CUSTOMER_TYPE_DISCOUNT_RATES: Record<CustomerType, number> = {
  regular: 0,
  member: 0.05,
  corporate: 0.1,
};

export class Customer extends Person {
  public constructor(
    id: ModelId,
    name: string,
    email: string,
    phone: string,
    public customerType: CustomerType,
    public address: string,
  ) {
    validateRequired("address", address);

    super(id, name, email, phone);

    this.customerType = customerType;
    this.address = address.trim();
  }

  getDiscountRate(): number {
    return CUSTOMER_TYPE_DISCOUNT_RATES[this.customerType];
  }
}
