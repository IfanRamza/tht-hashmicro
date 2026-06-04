import type { BaseModel, ModelId } from "../models";

export class BaseRepository<T extends BaseModel> {
  public constructor(protected readonly items: T[]) {}

  findAll(): T[] {
    return this.items;
  }

  findById(id: ModelId): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: T): T {
    this.items.push(item);
    return item;
  }

  update(id: ModelId, updater: (item: T) => void): T | undefined {
    const item = this.findById(id);

    if (!item) {
      return undefined;
    }

    updater(item);
    item.touch();

    return item;
  }

  delete(id: ModelId): boolean {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }
}
