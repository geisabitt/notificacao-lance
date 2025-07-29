import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type EventItem = {
  action: string;
  timestamp: string;
};

const events: EventItem[] = [];

export async function POST(request: Request) {
  const { action } = await request.json();
  const timestamp = new Date().toISOString();

  events.push({ action, timestamp });

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/push/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Novo Evento",
      message: `${action} às ${new Date().toLocaleTimeString()}`,
    }),
  });

  revalidatePath("/admin");
  return NextResponse.json({ message: "Evento registrado!", events });
}

export async function GET() {
  return NextResponse.json(events);
}
