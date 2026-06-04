import { db } from "../database/memory";
import { Customer } from "../models/person/Customer";
import { BaseRepository } from "./BaseRepository";

export const customerRepository = new BaseRepository<Customer>(db.customers);
