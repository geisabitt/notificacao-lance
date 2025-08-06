import { NextResponse } from "next/server";
import { addSubscription } from "@/lib/subscriptions";

export async function POST(request: Request) {
  const subscription = await request.json();
  addSubscription(subscription);
  return NextResponse.json({ message: "Inscrito com sucesso!" });
  // return new Response("Inscrito com sucesso!", { status: 201 });
}
