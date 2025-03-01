import { NextResponse } from "next/server";
import {fetchServerInfo} from "@/app/lib/rust-gateway"

export async function GET() {
  const info = await fetchServerInfo();

  return NextResponse.json(info);
}
