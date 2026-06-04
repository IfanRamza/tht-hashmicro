import { Order } from "../models/order/Order";
import { Customer } from "../models/person/Customer";
import { User } from "../models/person/User";
import { Product } from "../models/product/Product";
import { createUuidV7 } from "../utils/uuid";

export const db = {
  users: [
    new User(
      createUuidV7(),
      "Administrator",
      "admin@a.b",
      "081234567890",
      "admin",
      "admin123",
      "admin",
    ),
  ],
  customers: [
    new Customer(
      createUuidV7(),
      "PT Badan Gizi Nasional",
      "mbg@bgn.com",
      "0215550123",
      "corporate",
      "Jakarta",
    ),
    new Customer(
      createUuidV7(),
      "Rina Sari",
      "rina@sari.com",
      "0215550124",
      "regular",
      "Surabaya",
    ),
    new Customer(
      createUuidV7(),
      "Ifan Ramadhan Zaki",
      "ifan@gmail.com",
      "081234567891",
      "member",
      "Bandung",
    ),
  ],
  products: [
    new Product(createUuidV7(), "Laptop Gaming", "electronics", 12000000, 8),
    new Product(createUuidV7(), "Office Chair", "office", 1500000, 12),
    new Product(createUuidV7(), "Installation Service", "service", 5000000, 99),
  ],
  orders: [] as Order[],
};
