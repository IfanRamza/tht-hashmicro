import { db } from "../database/memory";
import { Order } from "../models/order/Order";
import { BaseRepository } from "./BaseRepository";

export const orderRepository = new BaseRepository<Order>(db.orders);
