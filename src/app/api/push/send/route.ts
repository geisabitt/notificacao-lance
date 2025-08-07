import { prisma } from "@/lib/prisma";
import webPush from "web-push";
import { NextResponse } from "next/server";

webPush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { title, message } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Título e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const subs = await prisma.notificationSubscription.findMany();
    const payload = JSON.stringify({ title, body: message });

    await Promise.all(
      subs.map(async (sub) => {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webPush.sendNotification(pushSub, payload);
        } catch (err: unknown) {
          if (typeof err === "object" && err && "statusCode" in err) {
            const errorObj = err as { statusCode?: number };
            console.error("Erro ao enviar push:", errorObj.statusCode);
            if (errorObj.statusCode === 410 || errorObj.statusCode === 404) {
              await prisma.notificationSubscription.delete({
                where: { endpoint: sub.endpoint },
              });
              console.log("Inscrição removida:", sub.endpoint);
            }
          } else {
            console.error("Erro ao enviar push:", err);
          }
        }
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar notificações:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
