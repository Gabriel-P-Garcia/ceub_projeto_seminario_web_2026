import { NextRequest, NextResponse } from "next/server";
import { buildSchema, graphql } from "graphql";
import { prisma } from "@/lib/prisma";

const schema = buildSchema(`
  type Species {
    id: ID!
    name: String!
    pronunciation: String
    meaning: String
    period: String
    periodEra: String!
    mya: String
    clade: String!
    family: String
    diet: String!
    habit: String
    length: Float
    height: Float
    weight: Float
    speed: Float
    discoveryYear: Int
    discoverer: String
    fossilLocations: String
    brazilOccurrence: Boolean
    descInfantil: String
    descEscolar: String
    descAcademica: String
    funFact: String
    skeletonNotes: String
    muscleNotes: String
    integumentNotes: String
    modelType: String
  }

  type CladeStat {
    clade: String!
    count: Int!
  }

  type Query {
    species(era: String, clade: String, diet: String, limit: Int): [Species!]!
    speciesById(id: String!): Species
    clades: [CladeStat!]!
    brazilianSpecies: [Species!]!
  }
`);

const root = {
  species: async (args: { era?: string; clade?: string; diet?: string; limit?: number }) => {
    const where: Record<string, unknown> = {};
    if (args.era) where.periodEra = args.era;
    if (args.clade) where.clade = args.clade;
    if (args.diet) where.diet = args.diet;

    return await prisma.species.findMany({
      where,
      take: args.limit || 50,
      orderBy: { name: "asc" },
    });
  },
  speciesById: async (args: { id: string }) => {
    return await prisma.species.findUnique({
      where: { id: args.id },
    });
  },
  clades: async () => {
    const all = await prisma.species.findMany({ select: { clade: true } });
    const counts: Record<string, number> = {};
    for (const item of all) {
      counts[item.clade] = (counts[item.clade] || 0) + 1;
    }
    return Object.entries(counts).map(([clade, count]) => ({ clade, count }));
  },
  brazilianSpecies: async () => {
    return await prisma.species.findMany({
      where: { brazilOccurrence: true },
      orderBy: { name: "asc" },
    });
  },
};

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    const response = await graphql({
      schema,
      source: query,
      rootValue: root,
      variableValues: variables,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro no GraphQL Handler:", error);
    return NextResponse.json(
      { errors: [{ message: "Erro ao processar consulta GraphQL" }] },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({
      message: "DinoPédia GraphQL Endpoint",
      schemaInfo: "Envie requisições POST com { query: '...' }",
      sampleQuery: `{ species(era: "Cretáceo") { name clade diet period } }`,
    });
  }

  const response = await graphql({
    schema,
    source: query,
    rootValue: root,
  });

  return NextResponse.json(response);
}
