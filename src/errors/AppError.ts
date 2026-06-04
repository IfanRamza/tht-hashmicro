export class AppError extends Error {
  public constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly errors?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
