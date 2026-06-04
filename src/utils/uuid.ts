import { uuidv7 } from "uuidv7";

export type Uuid = string;

export function createUuidV7(): Uuid {
  return uuidv7();
}
