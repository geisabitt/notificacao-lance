// src/app/api/push/send/route.ts
import { NextResponse } from "next/server";
import webPush from "web-push";
import { getSubscriptions } from "@/lib/subscriptions";

webPush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();
  const { title, message } = body;

  const subs = getSubscriptions();
  const payload = JSON.stringify({ title, body: message });

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webPush.sendNotification(sub, payload);
      } catch (err) {
        console.error("Erro ao enviar push", err);
      }
    })
  );

  return NextResponse.json({ success: true });
}
