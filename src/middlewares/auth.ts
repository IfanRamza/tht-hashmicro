import type { NextFunction, Request, Response } from "express";

const AUTH_COOKIE = "hashmicro_auth";
const AUTH_VALUE = "admin";

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, item) => {
    const [key, ...value] = item.trim().split("=");
    cookies[key] = decodeURIComponent(value.join("="));
    return cookies;
  }, {});
}

export function isAuthenticated(req: Request): boolean {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[AUTH_COOKIE] === AUTH_VALUE;
}

export function setAuthCookie(res: Response): void {
  res.setHeader("Set-Cookie", `${AUTH_COOKIE}=${AUTH_VALUE}; HttpOnly; Path=/`);
}

export function clearAuthCookie(res: Response): void {
  res.setHeader(
    "Set-Cookie",
    `${AUTH_COOKIE}=; HttpOnly; Path=/; Max-Age=0`,
  );
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (isAuthenticated(req)) {
    next();
    return;
  }

  res.redirect("/login");
}
