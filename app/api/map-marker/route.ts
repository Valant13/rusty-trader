import { NextResponse } from "next/server";
import { fetchTradeOffers } from "@/app/lib/rust-client"

export async function GET() {
  const tradeOffers = await fetchTradeOffers();

  return NextResponse.json(tradeOffers);
}
