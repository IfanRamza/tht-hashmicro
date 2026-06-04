import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";
import { AppError } from "../errors";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).render("shared/not-found", {
    title: "Page Not Found",
  });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Something went wrong";

  logger.error({ err, path: req.originalUrl, statusCode }, "request failed");

  res.status(statusCode).render("shared/error", {
    title: statusCode === 404 ? "Page Not Found" : "Something Went Wrong",
    message,
  });
}
