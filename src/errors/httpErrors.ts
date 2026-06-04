import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  public constructor(message = "Bad request", errors?: unknown) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  public constructor(message = "Unauthorized", errors?: unknown) {
    super(message, 401, errors);
  }
}

export class ForbiddenError extends AppError {
  public constructor(message = "Forbidden", errors?: unknown) {
    super(message, 403, errors);
  }
}

export class NotFoundError extends AppError {
  public constructor(message = "Resource not found", errors?: unknown) {
    super(message, 404, errors);
  }
}

export class ConflictError extends AppError {
  public constructor(message = "Conflict", errors?: unknown) {
    super(message, 409, errors);
  }
}

export class InternalServerError extends AppError {
  public constructor(message = "Internal server error", errors?: unknown) {
    super(message, 500, errors);
  }
}
