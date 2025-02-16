import { NextResponse } from "next/server";
import { getMapMarkers } from "@/app/lib/rust"

export async function GET() {
  let mapMarkers = await getMapMarkers();

  return NextResponse.json(mapMarkers);
}
