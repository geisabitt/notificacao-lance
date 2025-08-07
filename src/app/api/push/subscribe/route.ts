import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    const { endpoint, keys } = subscription;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await prisma.notificationSubscription.upsert({
      where: { endpoint },
      update: {},
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar inscrição:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
