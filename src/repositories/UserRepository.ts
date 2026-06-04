import { db } from "../database/memory";

export const userRepository = {
  findByUsername(username: string) {
    return db.users.find((user) => user.username === username.trim());
  },
};
