import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import path from "node:path";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { isAuthenticated, requireAuth } from "./middlewares/auth";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { authRoutes } from "./routes/authRoutes";
import { routes } from "./routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(requestLogger);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.isAuthenticated = isAuthenticated(req);
  next();
});

app.use(authRoutes);
app.get("/", requireAuth, (_req: Request, res: Response) => {
  res.redirect("/products");
});
app.use(requireAuth, routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(
    `Server is running on http://localhost:${env.port} (${env.nodeEnv})`,
  );
});

export default app;
