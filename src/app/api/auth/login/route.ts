import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔍 Buscar usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // ✅ Verificar senha
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // 🔐 Gerar token JWT (com jose)
    const token = await createToken({ id: user.id, role: user.role });

    // ✅ Resposta + Cookie
    const res = NextResponse.json({
      message: "Login bem-sucedido",
      user: { id: user.id, name: user.name, role: user.role },
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
