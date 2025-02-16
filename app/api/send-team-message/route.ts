import { NextResponse } from "next/server";
import { sendTeamMessage } from "@/app/lib/rust"

export async function GET() {
  await sendTeamMessage('Hello from rustplus.js!');

  return NextResponse.json({done: true});
}
