import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { question, term, level = "escolar", speciesName } = await request.json();

    const queryText = (question || term || speciesName || "").trim();
    if (!queryText) {
      return NextResponse.json(
        { success: false, error: "Pergunta ou termo não fornecido" },
        { status: 400 }
      );
    }

    // Se houver uma espécie correspondente no banco, recuperar dados contextuais
    const species = await prisma.species.findFirst({
      where: {
        OR: [
          { name: { contains: queryText } },
          { clade: { contains: queryText } },
          { family: { contains: queryText } },
        ],
      },
    });

    let explanation = "";
    let vocabulary: { term: string; definition: string }[] = [];
    let readingLevelLabel = "";

    // Adaptação por Faixa Etária (ADR-002)
    if (level === "infantil") {
      readingLevelLabel = "Nível Infantil (6-10 anos)";
      if (species) {
        explanation = `Olá, pequeno paleontólogo! Sobre o ${species.name}: ${species.descInfantil} Imagine só: ele pesava cerca de ${(species.weight / 1000).toFixed(1)} toneladas (isso é como vários carros empilhados!) e tinha ${species.length} metros de comprimento! Ele adorava viver no período ${species.periodEra}.`;
      } else {
        explanation = `Que pergunta legal sobre "${queryText}"! No tempo dos dinossauros, a Terra era bem diferente: não existiam cidades e plantas gigantes cobriam o chão. Dinossauros eram répteis especiais com pernas retas embaixo do corpo que botavam ovos com casca dura!`;
      }
      vocabulary = [
        { term: "Fóssil", definition: "Restos de ossos ou pegadas de animais de antigamente que viraram pedra." },
        { term: "Carnívoro", definition: "Bicho que come outros animais." },
        { term: "Herbívoro", definition: "Bicho que só come plantinhas e folhas." },
      ];
    } else if (level === "escolar") {
      readingLevelLabel = "Nível Curioso / Escolar (11-17 anos)";
      if (species) {
        explanation = `O ${species.name} foi um organismo fascinante do clado ${species.clade}. ${species.descEscolar} Seus fósseis foram documentados em ${species.fossilLocations}, datando de ${species.mya}. Sua biomecânica permitia atingir cerca de ${species.speed} km/h e exercer seu papel trófico como ${species.diet.toLowerCase()}. ${species.funFact}`;
      } else {
        explanation = `Sobre "${queryText}": No contexto da evolução biológica e paleontologia, os dinossauros dominaram a Era Mesozoica (Triássico, Jurássico e Cretáceo). A especiação ocorreu após a fragmentação do supercontinente Pangeia, gerando adaptações metabólicas como ossos pneumatizados e penas para termorregulação.`;
      }
      vocabulary = [
        { term: "Clado", definition: "Grupo de organismos que inclui um ancestral comum e todos os seus descendentes." },
        { term: "Estrigigrafia", definition: "Estudo das camadas de rochas para datar a época em que o animal viveu." },
        { term: "Nicho Ecológico", definition: "O papel e a função de uma espécie no ecossistema (predador, dispersor, etc.)." },
      ];
    } else {
      // Acadêmico
      readingLevelLabel = "Nível Científico / Acadêmico (Ensino Superior)";
      if (species) {
        explanation = `Diagnose taxonômica e filogenética de ${species.name} (${species.family}, ${species.clade}): ${species.descAcademica} Registro estratigráfico: ${species.period} (${species.mya}). Aspectos osteológicos e biomecânicos: ${species.skeletonNotes} Inserções miológicas: ${species.muscleNotes} Evidências tegumentares: ${species.integumentNotes}. Biogeografia de ocorrência: ${species.fossilLocations} (${species.brazilOccurrence ? "Província paleontológica brasileira com alta relevância de correlação gondwânica" : "Província laurasiática/internacional"}).`;
      } else {
        explanation = `Análise paleobiológica sobre "${queryText}": A evolução de Dinosauria dentro de Archosauria é demarcada por sinapomorfias do acetábulo perfurado e côndilos femorais especializados para postura ereta parassagital. A radiação adaptativa pós-extinção do Permo-Triássico permitiu a ocupação de nichos tróficos dominantes ao longo do Mesozoico até o limite K-Pg.`;
      }
      vocabulary = [
        { term: "Sinapomorfia", definition: "Caractere derivado compartilhado por dois ou mais táxons herdado do ancestral comum mais recente." },
        { term: "Homologia", definition: "Semelhança morfológica resultante de ancestralidade evolutiva compartilhada." },
        { term: "Pneumatização Esquelética", definition: "Presença de divertículos aéreos no tecido ósseo associados ao sistema respiratório unipulmonar." },
      ];
    }

    return NextResponse.json({
      success: true,
      query: queryText,
      level,
      readingLevelLabel,
      explanation,
      vocabulary,
      speciesMatched: species ? species.name : null,
    });
  } catch (error) {
    console.error("Erro no gerador adaptativo de IA:", error);
    return NextResponse.json(
      { success: false, error: "Falha na geração adaptativa de linguagem" },
      { status: 500 }
    );
  }
}
