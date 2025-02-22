import { NextResponse } from "next/server";
import { sendTeamMessage } from "@/app/lib/rust-gateway"

export async function GET() {
  await sendTeamMessage('Hello from rustplus.js!');

  return NextResponse.json({done: true});
}
