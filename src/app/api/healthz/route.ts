import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = performance.now();
  try {
    // Verificação de conexão com o banco relacional SQLite
    await prisma.$queryRaw`SELECT 1`;
    const latency = Math.round(performance.now() - startTime);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "DinoPédia API Core",
      version: "1.0.0",
      database: "connected",
      latencyMs: latency,
      compliance: {
        slaTarget: "99.9%",
        apiResponseTimeSla: "< 300ms",
        achieved: latency < 300,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
