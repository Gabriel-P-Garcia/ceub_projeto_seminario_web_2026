import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get("level"); // "infantil", "escolar", "academico"
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (level && level !== "all") {
      where.level = level;
    }
    if (category && category !== "all") {
      where.category = category;
    }

    const questions = await prisma.quizQuestion.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    const parsedQuestions = questions.map((q) => ({
      ...q,
      options: JSON.parse(q.options),
    }));

    return NextResponse.json({ success: true, data: parsedQuestions });
  } catch (error) {
    console.error("Erro ao buscar perguntas do quiz:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao obter perguntas do quiz" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, selectedIndex } = body;

    const question = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Pergunta não encontrada" },
        { status: 404 }
      );
    }

    const isCorrect = question.correctIndex === selectedIndex;
    const parsedOptions = JSON.parse(question.options);

    return NextResponse.json({
      success: true,
      isCorrect,
      correctIndex: question.correctIndex,
      correctText: parsedOptions[question.correctIndex],
      explanation: question.explanation,
    });
  } catch (error) {
    console.error("Erro ao validar resposta:", error);
    return NextResponse.json(
      { success: false, error: "Erro na validação do quiz" },
      { status: 500 }
    );
  }
}
