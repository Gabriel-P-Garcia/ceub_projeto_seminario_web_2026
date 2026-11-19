import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (category && category !== "all") {
      where.category = category;
    }

    const topics = await prisma.forumTopic.findMany({
      where,
      include: {
        posts: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    console.error("Erro ao listar tópicos do fórum:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao consultar fórum" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, topicId, title, content, category, authorName, authorRole } = body;

    const isVerified = authorRole === "Paleontólogo Curador" || authorRole === "Administrador";

    if (action === "create_reply") {
      if (!topicId || !content) {
        return NextResponse.json(
          { success: false, error: "Tópico e conteúdo são obrigatórios" },
          { status: 400 }
        );
      }

      const post = await prisma.forumPost.create({
        data: {
          topicId,
          content,
          authorName: authorName || "Explorador Anônimo",
          authorRole: authorRole || "Aluno",
          isVerified,
        },
      });

      return NextResponse.json({ success: true, data: post }, { status: 201 });
    }

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    const newTopic = await prisma.forumTopic.create({
      data: {
        title,
        content,
        category: category || "Dúvidas Escolares",
        authorName: authorName || "Explorador Anônimo",
        authorRole: authorRole || "Aluno",
        isVerified,
      },
      include: {
        posts: true,
      },
    });

    return NextResponse.json({ success: true, data: newTopic }, { status: 201 });
  } catch (error) {
    console.error("Erro ao processar fórum:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao gravar mensagem no fórum" },
      { status: 500 }
    );
  }
}
