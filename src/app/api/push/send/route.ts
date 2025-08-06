// src/app/api/push/send/route.ts
import { NextResponse } from "next/server";
import webPush from "web-push";
import { getSubscriptions, removeSubscription } from "@/lib/subscriptions";

webPush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, message } = await req.json();
    const subs = getSubscriptions();
    const payload = JSON.stringify({ title, body: message });

    console.log(`Enviando notificação para ${subs.length} dispositivos`);

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webPush.sendNotification(sub, payload);
        } catch (err: unknown) {
          if (typeof err === "object" && err && "statusCode" in err) {
            const errorObj = err as { statusCode?: number };
            if (errorObj.statusCode === 410 || errorObj.statusCode === 404) {
              removeSubscription(sub.endpoint);
            }
          }
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
