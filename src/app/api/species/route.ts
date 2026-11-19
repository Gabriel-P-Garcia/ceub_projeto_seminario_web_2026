import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const periodEra = searchParams.get("periodEra");
    const diet = searchParams.get("diet");
    const clade = searchParams.get("clade");
    const brazilOnly = searchParams.get("brazilOnly") === "true";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { meaning: { contains: search } },
        { discoverer: { contains: search } },
        { fossilLocations: { contains: search } },
      ];
    }

    if (periodEra && periodEra !== "all") {
      where.periodEra = periodEra;
    }

    if (diet && diet !== "all") {
      where.diet = diet;
    }

    if (clade && clade !== "all") {
      where.clade = clade;
    }

    if (brazilOnly) {
      where.brazilOccurrence = true;
    }

    const species = await prisma.species.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, count: species.length, data: species });
  } catch (error) {
    console.error("Erro ao listar espécies:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao consultar catálogo de espécies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSpecies = await prisma.species.create({
      data: {
        name: body.name,
        pronunciation: body.pronunciation || body.name,
        meaning: body.meaning || "Significado a catalogar",
        period: body.period || "Cretáceo",
        periodEra: body.periodEra || "Cretáceo",
        mya: body.mya || "70 Ma",
        myaStart: parseFloat(body.myaStart) || 70.0,
        myaEnd: parseFloat(body.myaEnd) || 66.0,
        clade: body.clade || "Theropoda",
        family: body.family || "Desconhecida",
        diet: body.diet || "Carnívoro",
        habit: body.habit || "Bípede Terrestre",
        length: parseFloat(body.length) || 5.0,
        height: parseFloat(body.height) || 2.0,
        weight: parseFloat(body.weight) || 1000,
        speed: parseFloat(body.speed) || 25,
        discoveryYear: parseInt(body.discoveryYear) || new Date().getFullYear(),
        discoverer: body.discoverer || "Curador DinoPédia",
        fossilLocations: body.fossilLocations || "Localização a registrar",
        latitude: body.latitude ? parseFloat(body.latitude) : null,
        longitude: body.longitude ? parseFloat(body.longitude) : null,
        brazilOccurrence: Boolean(body.brazilOccurrence),
        descInfantil: body.descInfantil || "Um dinossauro incrível para aprender!",
        descEscolar: body.descEscolar || "Espécie fóssil com grande importância didática.",
        descAcademica: body.descAcademica || "Espécime com caracteres apomórficos relevantes.",
        funFact: body.funFact || "Descoberta recente registrada pela curadoria.",
        dietDetails: body.dietDetails || "Dieta adaptada ao nicho ecológico mesozoico.",
        skeletonNotes: body.skeletonNotes || "Morfologia esquelética padrão do clado.",
        muscleNotes: body.muscleNotes || "Musculatura proporcional à massa corporal estimada.",
        integumentNotes: body.integumentNotes || "Tegumento dérmico escamoso ou filamentar.",
        modelType: body.modelType || "theropod",
        colorTheme: body.colorTheme || "#e28743",
      },
    });

    await prisma.curationLog.create({
      data: {
        action: "CREATE_SPECIES",
        author: body.author || "Curador DinoPédia",
        details: `Criação da espécie ${newSpecies.name} (${newSpecies.clade})`,
      },
    });

    return NextResponse.json({ success: true, data: newSpecies }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar espécie:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao cadastrar nova espécie" },
      { status: 500 }
    );
  }
}
