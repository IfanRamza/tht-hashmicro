import { BaseModel, type ModelId } from "../BaseModel";
import { validateRequired } from "../../utils/validators";

export abstract class Person extends BaseModel {
  protected constructor(
    id: ModelId,
    public name: string,
    public email: string,
    public phone: string,
  ) {
    validateRequired("name", name);
    validateRequired("email", email);
    validateRequired("phone", phone);

    super(id);

    this.name = name.trim();
    this.email = email.trim().toLowerCase();
    this.phone = phone.trim();
  }

  getDisplayName(): string {
    return this.name;
  }

  static getDisplayName(person: Pick<Person, "name" | "email">): string {
    return person.name.trim() || person.email.trim().toLowerCase();
  }

  updateContactInfo(email: string, phone: string): void {
    validateRequired("email", email);
    validateRequired("phone", phone);

    this.email = email.trim().toLowerCase();
    this.phone = phone.trim();
    this.touch();
  }
}
