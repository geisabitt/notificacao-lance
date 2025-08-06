// src/app/api/push/subscribe/route.ts
import { NextResponse } from "next/server";
import { addSubscription } from "@/lib/subscriptions";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Inscrição inválida" },
        { status: 400 }
      );
    }

    addSubscription(subscription);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao inscrever:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
