import type { Request, Response } from "express";
import { logger } from "../config/logger";
import { clearAuthCookie, setAuthCookie } from "../middlewares/auth";
import { authService, type AuthService } from "../services/AuthService";

type AuthControllerDependencies = {
  authService: AuthService;
  logger: Pick<typeof logger, "info" | "warn">;
  setAuthCookie: typeof setAuthCookie;
  clearAuthCookie: typeof clearAuthCookie;
};

export function createAuthController(dependencies: AuthControllerDependencies) {
  const { authService, logger, setAuthCookie, clearAuthCookie } = dependencies;

  return {
    showLogin(_req: Request, res: Response): void {
      res.render("auth/login", { title: "Login", error: null });
    },

    login(req: Request, res: Response): void {
      const { username, password } = req.body as {
        username?: string;
        password?: string;
      };
      const user = authService.authenticate(username, password);

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
  authService,
  logger,
  setAuthCookie,
  clearAuthCookie,
});
