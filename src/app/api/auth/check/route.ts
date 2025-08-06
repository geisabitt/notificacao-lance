import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecret"
);

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
