import { NotFoundError } from "../errors";
import {
  Customer,
  type ModelId,
  type CustomerType,
  CUSTOMER_TYPE_DISCOUNT_RATES,
} from "../models";
import { customerRepository } from "../repositories/CustomerRepository";
import { createUuidV7 } from "../utils/uuid";

export type SaveCustomerInput = {
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  address: string;
};

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

type CustomerServiceDependencies = {
  customerRepository: CustomerRepositoryPort;
  createId: typeof createUuidV7;
};

export const CUSTOMER_TYPES: CustomerType[] = ["regular", "member", "corporate"];

export function createCustomerService(
  dependencies: CustomerServiceDependencies,
) {
  const { customerRepository, createId } = dependencies;

  return {
    listCustomers(): Customer[] {
      return customerRepository.findAll();
    },

    getCustomer(id: string): Customer {
      const customer = customerRepository.findById(id);

      if (!customer) {
        throw new NotFoundError("Customer not found");
      }

      return customer;
    },

    getCustomerTypes(): CustomerType[] {
      return CUSTOMER_TYPES;
    },

    getDiscountRates(): typeof CUSTOMER_TYPE_DISCOUNT_RATES {
      return CUSTOMER_TYPE_DISCOUNT_RATES;
    },

    createCustomer(input: SaveCustomerInput): Customer {
      return customerRepository.create(
        new Customer(
          createId(),
          input.name,
          input.email,
          input.phone,
          input.customerType,
          input.address,
        ),
      );
    },

    updateCustomer(id: string, input: SaveCustomerInput): Customer | undefined {
      return customerRepository.update(id, (customer) => {
        customer.name = input.name.trim();
        customer.email = input.email.trim().toLowerCase();
        customer.phone = input.phone.trim();
        customer.customerType = input.customerType;
        customer.address = input.address.trim();
      });
    },

    deleteCustomer(id: string): boolean {
      return customerRepository.delete(id);
    },
  };
}

export type CustomerService = ReturnType<typeof createCustomerService>;

export const customerService = createCustomerService({
  customerRepository,
  createId: createUuidV7,
});
