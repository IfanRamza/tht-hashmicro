import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors";
import type { Customer, ModelId, Product } from "../models";
import { Order } from "../models/order/Order";
import { OrderItem } from "../models/order/OrderItem";
import { customerRepository } from "../repositories/CustomerRepository";
import { orderRepository } from "../repositories/OrderRepository";
import { productRepository } from "../repositories/ProductRepository";
import { createUuidV7 } from "../utils/uuid";

type ItemInput = {
  productId: string;
  quantity: string;
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

type OrderControllerDependencies = {
  customerRepository: CustomerRepositoryPort;
  productRepository: ProductRepositoryPort;
  orderRepository: OrderRepositoryPort;
  createId: typeof createUuidV7;
  createOrderCode: () => string;
};

function normalizeItems(body: Record<string, unknown>): ItemInput[] {
  const productIds = Array.isArray(body.productId)
    ? body.productId
    : body.productId
      ? [body.productId]
      : [];
  const quantities = Array.isArray(body.quantity)
    ? body.quantity
    : body.quantity
      ? [body.quantity]
      : [];

  if (productIds.length === 0 || quantities.length === 0) {
    return [];
  }

  return productIds.map((productId, index) => ({
    productId: String(productId),
    quantity: String(quantities[index] ?? "0"),
  }));
}

function findOrderOrFail(repository: OrderRepositoryPort, id: string): Order {
  const order = repository.findById(id);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
}

export function createOrderController(dependencies: OrderControllerDependencies) {
  const {
    customerRepository,
    productRepository,
    orderRepository,
    createId,
    createOrderCode,
  } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("orders/index", {
        title: "Orders",
        orders: orderRepository.findAll(),
      });
    },

    create(_req: Request, res: Response): void {
      res.render("orders/create", {
        title: "Create Order",
        customers: customerRepository.findAll(),
        products: productRepository.findAll(),
      });
    },

    store(req: Request, res: Response): void {
      const body = req.body as Record<string, unknown>;
      const customer = customerRepository.findById(String(body.customerId));

      if (!customer) {
        throw new BadRequestError("Customer is required");
      }

      const items: OrderItem[] = [];

      for (const input of normalizeItems(body)) {
        const product = productRepository.findById(input.productId);
        const quantity = Number(input.quantity);

        if (product && quantity > 0) {
          items.push(new OrderItem(createId(), product, quantity));
        }
      }

      if (items.length === 0) {
        throw new BadRequestError("At least one valid order item is required");
      }

      const order = new Order(
        createId(),
        createOrderCode(),
        customer,
        items,
        "confirmed",
      );

      orderRepository.create(order);
      res.redirect(`/orders/${order.id}`);
    },

    show(req: Request, res: Response): void {
      const order = findOrderOrFail(orderRepository, String(req.params.id));

      res.render("orders/show", {
        title: order.code,
        order,
      });
    },

    markAsPaid(req: Request, res: Response): void {
      const order = findOrderOrFail(orderRepository, String(req.params.id));

      try {
        order.markAsPaid();
      } catch (error) {
        throw new BadRequestError((error as Error).message);
      }

      res.redirect("/orders");
    },

    cancel(req: Request, res: Response): void {
      const order = findOrderOrFail(orderRepository, String(req.params.id));

      try {
        order.cancel();
      } catch (error) {
        throw new BadRequestError((error as Error).message);
      }

      res.redirect("/orders");
    },

    destroy(req: Request, res: Response): void {
      orderRepository.delete(String(req.params.id));
      res.redirect("/orders");
    },
  };
}

export const orderController = createOrderController({
  customerRepository,
  productRepository,
  orderRepository,
  createId: createUuidV7,
  createOrderCode: () => `SO-${Date.now()}`,
});
