import { NextResponse } from "next/server";
import { sendTeamMessage } from "@/app/lib/rust-gateway"

export async function GET() {
  const response = await sendTeamMessage('Hello from rustplus.js!');

  return NextResponse.json(response);
}
