import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "supersecret";
const SECRET = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

import type { JWTPayload } from "jose";

export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload;
}

export async function setAuthCookie(token: string) {
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });
}

export async function getAuthCookie() {
  const token = (await cookies()).get("auth_token")?.value;
  return token ? await verifyToken(token) : null;
}

export async function removeAuthCookie() {
  (await cookies()).delete("auth_token");
}
