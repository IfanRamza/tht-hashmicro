import { BadRequestError, NotFoundError } from "../errors";
import type { Customer, ModelId, Product } from "../models";
import { Order } from "../models/order/Order";
import { OrderItem } from "../models/order/OrderItem";
import { customerRepository } from "../repositories/CustomerRepository";
import { orderRepository } from "../repositories/OrderRepository";
import { productRepository } from "../repositories/ProductRepository";
import { createUuidV7 } from "../utils/uuid";

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerId: string;
  items: CreateOrderItemInput[];
};

type ResolvedOrderItem = {
  product: Product;
  quantity: number;
};

type CustomerRepositoryPort = {
  findAll(): Customer[];
  findById(id: ModelId): Customer | undefined;
};

type ProductRepositoryPort = {
  findAll(): Product[];
  findById(id: ModelId): Product | undefined;
};

type OrderRepositoryPort = {
  findAll(): Order[];
  findById(id: ModelId): Order | undefined;
  create(order: Order): Order;
  delete(id: ModelId): boolean;
};

type OrderServiceDependencies = {
  customerRepository: CustomerRepositoryPort;
  productRepository: ProductRepositoryPort;
  orderRepository: OrderRepositoryPort;
  createId: typeof createUuidV7;
  createOrderCode: () => string;
};

function findOrderOrFail(repository: OrderRepositoryPort, id: string): Order {
  const order = repository.findById(id);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
}

export function createOrderService(dependencies: OrderServiceDependencies) {
  const {
    customerRepository,
    productRepository,
    orderRepository,
    createId,
    createOrderCode,
  } = dependencies;

  return {
    listOrders(): Order[] {
      return orderRepository.findAll();
    },

    listCustomers(): Customer[] {
      return customerRepository.findAll();
    },

    listAvailableProducts(): Product[] {
      return productRepository
        .findAll()
        .filter((product) => product.stock > 0);
    },

    findOrderById(id: string): Order {
      return findOrderOrFail(orderRepository, id);
    },

    createOrder(input: CreateOrderInput): Order {
      const customer = customerRepository.findById(input.customerId);

      if (!customer) {
        throw new BadRequestError("Customer is required");
      }

      const resolvedItems: ResolvedOrderItem[] = [];

      for (const item of input.items) {
        const product = productRepository.findById(item.productId);
        const quantity = Number(item.quantity);

        if (!product || quantity <= 0) {
          continue;
        }

        if (!product.isAvailable(quantity)) {
          throw new BadRequestError(
            `${product.name} only has ${product.stock} item(s) in stock`,
          );
        }

        resolvedItems.push({ product, quantity });
      }

      if (resolvedItems.length === 0) {
        throw new BadRequestError("At least one valid order item is required");
      }

      const orderItems = resolvedItems.map(
        ({ product, quantity }) => new OrderItem(createId(), product, quantity),
      );
      const order = new Order(
        createId(),
        createOrderCode(),
        customer,
        orderItems,
        "confirmed",
      );

      orderRepository.create(order);

      for (const { product, quantity } of resolvedItems) {
        product.decreaseStock(quantity);
      }

      return order;
    },

    markAsPaid(id: string): Order {
      const order = findOrderOrFail(orderRepository, id);

      try {
        order.markAsPaid();
      } catch (error) {
        throw new BadRequestError((error as Error).message);
      }

      return order;
    },

    cancel(id: string): Order {
      const order = findOrderOrFail(orderRepository, id);

      try {
        order.cancel();
      } catch (error) {
        throw new BadRequestError((error as Error).message);
      }

      for (const item of order.items) {
        item.product.increaseStock(item.quantity);
      }

      return order;
    },

    delete(id: string): boolean {
      return orderRepository.delete(id);
    },
  };
}

export type OrderService = ReturnType<typeof createOrderService>;

export const orderService = createOrderService({
  customerRepository,
  productRepository,
  orderRepository,
  createId: createUuidV7,
  createOrderCode: () => `SO-${Date.now()}`,
});
