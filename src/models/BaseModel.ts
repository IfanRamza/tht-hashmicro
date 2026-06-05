import { createUuidV7 } from "../utils/uuid";

export type ModelId = string;

export abstract class BaseModel {
  protected constructor(
    public readonly id: ModelId = createUuidV7(),
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  touch(): void {
    this.updatedAt = new Date();
  }
}
