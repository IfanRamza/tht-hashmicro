import type { Request, Response } from "express";
import { logger } from "../config/logger";
import { clearAuthCookie, setAuthCookie } from "../middlewares/auth";
import type { User } from "../models";
import { userRepository } from "../repositories/UserRepository";

type UserRepositoryPort = {
  findByUsername(username: string): User | undefined;
};

type AuthControllerDependencies = {
  userRepository: UserRepositoryPort;
  logger: Pick<typeof logger, "info" | "warn">;
  setAuthCookie: typeof setAuthCookie;
  clearAuthCookie: typeof clearAuthCookie;
};

export function createAuthController(dependencies: AuthControllerDependencies) {
  const { userRepository, logger, setAuthCookie, clearAuthCookie } = dependencies;

  return {
    showLogin(_req: Request, res: Response): void {
      res.render("auth/login", { title: "Login", error: null });
    },

    login(req: Request, res: Response): void {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };
      const user = username ? userRepository.findByUsername(username) : undefined;

      if (!user || user.getPasswordHash() !== password) {
        logger.warn({ username }, "login failed");
        res.status(401).render("auth/login", {
          title: "Login",
          error: "Invalid username or password",
        });
        return;
      }

      setAuthCookie(res);
      logger.info({ username: user.username }, "login success");
      res.redirect("/products");
    },

    logout(_req: Request, res: Response): void {
      clearAuthCookie(res);
      res.redirect("/login");
    },
  };
}

export const authController = createAuthController({
  userRepository,
  logger,
  setAuthCookie,
  clearAuthCookie,
});
