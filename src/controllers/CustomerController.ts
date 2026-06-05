import type { Request, Response } from "express";
import type { CustomerType } from "../models";
import {
  customerService,
  type CustomerService,
} from "../services/CustomerService";

type CustomerControllerDependencies = {
  customerService: CustomerService;
};

export function createCustomerController(
  dependencies: CustomerControllerDependencies,
) {
  const { customerService } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("customers/index", {
        title: "Customers",
        customers: customerService.listCustomers(),
        discountRates: customerService.getDiscountRates(),
      });
    },

    create(_req: Request, res: Response): void {
      res.render("customers/form", {
        title: "Create Customer",
        customer: null,
        customerTypes: customerService.getCustomerTypes(),
        discountRates: customerService.getDiscountRates(),
        action: "/customers",
      });
    },

    store(req: Request, res: Response): void {
      const { name, email, phone, customerType, address } =
        req.body as Record<string, string>;

      customerService.createCustomer({
        name,
        email,
        phone,
        customerType: customerType as CustomerType,
        address,
      });

      res.redirect("/customers");
    },

    edit(req: Request, res: Response): void {
      const customer = customerService.getCustomer(String(req.params.id));

      res.render("customers/form", {
        title: "Edit Customer",
        customer,
        customerTypes: customerService.getCustomerTypes(),
        discountRates: customerService.getDiscountRates(),
        action: `/customers/${customer.id}/update`,
      });
    },

    update(req: Request, res: Response): void {
      const { name, email, phone, customerType, address } =
        req.body as Record<string, string>;

      customerService.updateCustomer(String(req.params.id), {
        name,
        email,
        phone,
        customerType: customerType as CustomerType,
        address,
      });

      res.redirect("/customers");
    },

    destroy(req: Request, res: Response): void {
      customerService.deleteCustomer(String(req.params.id));
      res.redirect("/customers");
    },
  };
}

export const customerController = createCustomerController({
  customerService,
});
