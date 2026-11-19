import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const species = await prisma.species.findFirst({
      where: {
        OR: [{ id }, { name: { equals: decodeURIComponent(id) } }],
      },
    });

    if (!species) {
      return NextResponse.json(
        { success: false, error: "Espécie não encontrada" },
        { status: 404 }
      );
    }

    // Buscar espécies relacionadas do mesmo período ou clado
    const related = await prisma.species.findMany({
      where: {
        id: { not: species.id },
        OR: [{ periodEra: species.periodEra }, { clade: species.clade }],
      },
      take: 4,
      select: {
        id: true,
        name: true,
        periodEra: true,
        clade: true,
        diet: true,
        length: true,
        colorTheme: true,
      },
    });

    return NextResponse.json({ success: true, data: species, related });
  } catch (error) {
    console.error("Erro ao obter espécie:", error);
    return NextResponse.json(
      { success: false, error: "Falha interna ao recuperar espécie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.species.update({
      where: { id },
      data: {
        ...body,
        length: body.length ? parseFloat(body.length) : undefined,
        height: body.height ? parseFloat(body.height) : undefined,
        weight: body.weight ? parseFloat(body.weight) : undefined,
        speed: body.speed ? parseFloat(body.speed) : undefined,
        discoveryYear: body.discoveryYear ? parseInt(body.discoveryYear) : undefined,
        brazilOccurrence: body.brazilOccurrence !== undefined ? Boolean(body.brazilOccurrence) : undefined,
      },
    });

    await prisma.curationLog.create({
      data: {
        action: "UPDATE_DESC",
        author: body.author || "Curador DinoPédia",
        details: `Atualização taxonômica da espécie ${updated.name}`,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Erro ao atualizar espécie:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao atualizar dados da espécie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const deleted = await prisma.species.delete({
      where: { id },
    });

    await prisma.curationLog.create({
      data: {
        action: "DELETE_SPECIES",
        author: "Curador DinoPédia",
        details: `Remoção da espécie ${deleted.name}`,
      },
    });

    return NextResponse.json({ success: true, message: "Espécie removida com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar espécie:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao remover espécie" },
      { status: 500 }
    );
  }
}
