import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { action } = await request.json();

  const newEvent = await prisma.event.create({
    data: {
      action,
    },
  });

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/push/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Novo Evento",
      message: `${action} às ${new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      })}`,
    }),
  });

  revalidatePath("/admin");

  return NextResponse.json({ message: "Evento registrado!", event: newEvent });
}

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: {
      timestamp: "desc",
    },
  });

  return NextResponse.json(events);
}
