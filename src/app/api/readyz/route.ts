import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const speciesCount = await prisma.species.count();
    return NextResponse.json({
      status: "ready",
      database: "online",
      speciesIndexed: speciesCount,
      cacheStatus: "warm",
      readyForTraffic: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "not_ready",
        error: String(error),
      },
      { status: 503 }
    );
  }
}
