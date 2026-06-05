import type { Request, Response } from "express";
import { NotFoundError } from "../errors";
import {
  Customer,
  type ModelId,
  type CustomerType,
  CUSTOMER_TYPE_DISCOUNT_RATES,
} from "../models";
import { customerRepository } from "../repositories/CustomerRepository";
import { createUuidV7 } from "../utils/uuid";

const customerTypes: CustomerType[] = ["regular", "member", "corporate"];

type CustomerRepositoryPort = {
  findAll(): Customer[];
  findById(id: ModelId): Customer | undefined;
  create(customer: Customer): Customer;
  update(
    id: ModelId,
    updater: (customer: Customer) => void,
  ): Customer | undefined;
  delete(id: ModelId): boolean;
};

type CustomerControllerDependencies = {
  customerRepository: CustomerRepositoryPort;
  createId: typeof createUuidV7;
};

export function createCustomerController(
  dependencies: CustomerControllerDependencies,
) {
  const { customerRepository, createId } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("customers/index", {
        title: "Customers",
        customers: customerRepository.findAll(),
        discountRates: CUSTOMER_TYPE_DISCOUNT_RATES,
      });
    },

    create(_req: Request, res: Response): void {
      res.render("customers/form", {
        title: "Create Customer",
        customer: null,
        customerTypes,
        discountRates: CUSTOMER_TYPE_DISCOUNT_RATES,
        action: "/customers",
      });
    },

    store(req: Request, res: Response): void {
      const { name, email, phone, customerType, address } =
        req.body as Record<string, string>;

      customerRepository.create(
        new Customer(
          createId(),
          name,
          email,
          phone,
          customerType as CustomerType,
          address,
        ),
      );

      res.redirect("/customers");
    },

    edit(req: Request, res: Response): void {
      const customer = customerRepository.findById(String(req.params.id));

      if (!customer) {
        throw new NotFoundError("Customer not found");
      }

      res.render("customers/form", {
        title: "Edit Customer",
        customer,
        customerTypes,
        discountRates: CUSTOMER_TYPE_DISCOUNT_RATES,
        action: `/customers/${customer.id}/update`,
      });
    },

    update(req: Request, res: Response): void {
      const { name, email, phone, customerType, address } =
        req.body as Record<string, string>;

      customerRepository.update(String(req.params.id), (customer) => {
        customer.name = name.trim();
        customer.email = email.trim().toLowerCase();
        customer.phone = phone.trim();
        customer.customerType = customerType as CustomerType;
        customer.address = address.trim();
      });

      res.redirect("/customers");
    },

    destroy(req: Request, res: Response): void {
      customerRepository.delete(String(req.params.id));
      res.redirect("/customers");
    },
  };
}

export const customerController = createCustomerController({
  customerRepository,
  createId: createUuidV7,
});
