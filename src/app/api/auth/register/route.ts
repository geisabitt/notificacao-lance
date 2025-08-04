import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    },
  });

  return NextResponse.json({ message: "Usuário registrado!", user });
}
