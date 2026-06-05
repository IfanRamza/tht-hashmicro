import { BaseModel, type ModelId } from "../BaseModel";
import { validateRequired } from "../../utils/validators";

export type TransactionStatus = "draft" | "confirmed" | "paid" | "cancelled";

export abstract class Transaction extends BaseModel {
  protected constructor(
    id: ModelId,
    public code: string,
    public status: TransactionStatus = "draft",
    public transactionDate: Date = new Date(),
  ) {
    validateRequired("code", code);

    super(id);
    this.code = code.trim().toUpperCase();
    this.status = status;
    this.transactionDate = transactionDate;
  }

  markAsPaid(): void {
    if (this.status !== "confirmed") {
      throw new Error("Only confirmed transactions can be marked as paid");
    }

    this.status = "paid";
    this.touch();
  }

  cancel(): void {
    if (this.status === "paid") {
      throw new Error("Paid transactions cannot be cancelled");
    }

    this.status = "cancelled";
    this.touch();
  }
}
