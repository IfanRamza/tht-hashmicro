import type { Request, Response } from "express";
import { BadRequestError } from "../errors";
import {
  type CreateOrderItemInput,
  orderService,
  type OrderService,
} from "../services/OrderService";

type ItemInput = {
  productId: string;
  quantity: string;
};

type OrderControllerDependencies = {
  orderService: OrderService;
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

function renderCreateOrderForm(
  res: Response,
  service: OrderService,
  error: string | null,
): void {
  res.status(error ? 400 : 200).render("orders/create", {
    title: "Create Order",
    customers: service.listCustomers(),
    products: service.listAvailableProducts(),
    error,
  });
}

export function createOrderController(dependencies: OrderControllerDependencies) {
  const { orderService } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("orders/index", {
        title: "Orders",
        orders: orderService.listOrders(),
      });
    },

    create(_req: Request, res: Response): void {
      renderCreateOrderForm(res, orderService, null);
    },

    store(req: Request, res: Response): void {
      const body = req.body as Record<string, unknown>;
      const items: CreateOrderItemInput[] = normalizeItems(body).map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
      }));

      try {
        const order = orderService.createOrder({
          customerId: String(body.customerId),
          items,
        });

        res.redirect(`/orders/${order.id}`);
      } catch (error) {
        if (!(error instanceof BadRequestError)) {
          throw error;
        }

        renderCreateOrderForm(res, orderService, error.message);
      }
    },

    show(req: Request, res: Response): void {
      const order = orderService.findOrderById(String(req.params.id));

      res.render("orders/show", {
        title: order.code,
        order,
      });
    },

    markAsPaid(req: Request, res: Response): void {
      orderService.markAsPaid(String(req.params.id));
      res.redirect("/orders");
    },

    cancel(req: Request, res: Response): void {
      orderService.cancel(String(req.params.id));
      res.redirect("/orders");
    },

    destroy(req: Request, res: Response): void {
      orderService.delete(String(req.params.id));
      res.redirect("/orders");
    },
  };
}

export const orderController = createOrderController({
  orderService,
});
