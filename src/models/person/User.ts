import { validateRequired } from "../../utils/validators";
import type { ModelId } from "../BaseModel";
import { Person } from "./Person";

export type UserRole = "admin" | "user" | "guest";

export class User extends Person {
  public constructor(
    id: ModelId,
    name: string,
    email: string,
    phone: string,
    public username: string,
    private passwordHash: string,
    public role: UserRole,
  ) {
    validateRequired("username", username);
    validateRequired("passwordHash", passwordHash);

    super(id, name, email, phone);

    this.username = username.trim();
    this.passwordHash = passwordHash;
    this.role = role;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}
