import { createHmac, timingSafeEqual } from "node:crypto";
import {
  deleteCookie,
  getCookie,
  setCookie,
  type H3Event,
} from "h3";

const cookieName = "mered_admin_auth";
const sessionTtlMs = 12 * 60 * 60 * 1000;

const getSecret = () =>
  process.env.ADMIN_AUTH_SECRET || process.env.ADMIN_PASSWORD || "";

const sign = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("hex");

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export const isAdminAuthConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export const verifyAdminCredentials = (username: string, password: string) => {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  return (
    Boolean(expectedPassword) &&
    username === expectedUsername &&
    safeEqual(password, expectedPassword ?? "")
  );
};

export const hasValidAdminSession = (event: H3Event) => {
  const token = getCookie(event, cookieName);

  if (!token) {
    return false;
  }

  const [expiresAt, signature] = token.split(".");

  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) {
    return false;
  }

  return safeEqual(signature, sign(expiresAt));
};

export const setAdminSession = (event: H3Event) => {
  const expiresAt = String(Date.now() + sessionTtlMs);

  setCookie(event, cookieName, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    maxAge: sessionTtlMs / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearAdminSession = (event: H3Event) => {
  deleteCookie(event, cookieName, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
