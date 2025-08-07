// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth_token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "Logout realizado" });
}
