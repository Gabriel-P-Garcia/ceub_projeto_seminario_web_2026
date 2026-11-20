import { NextResponse } from "next/server";
import { createSession, createPasswordHash, getCurrentUser, isValidEmail, normalizeEmail, verifyPassword, clearSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function userResponse(user: { id: string; name: string; email: string; role: string }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ authenticated: Boolean(user), user: user ? userResponse(user) : null });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action === "register" ? "register" : "login";
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");

    if (!isValidEmail(email) || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Informe um e-mail válido e uma senha com pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    if (action === "register") {
      const name = String(body.name ?? "").trim();
      if (name.length < 2) {
        return NextResponse.json({ success: false, error: "Informe seu nome." }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ success: false, error: "Este e-mail já está cadastrado." }, { status: 409 });
      }

      const user = await prisma.user.create({
        data: { name, email, passwordHash: createPasswordHash(password) },
      });
      await createSession(user.id);
      return NextResponse.json({ success: true, user: userResponse(user) }, { status: 201 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ success: false, error: "E-mail ou senha inválidos." }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ success: true, user: userResponse(user) });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return NextResponse.json({ success: false, error: "Não foi possível concluir o acesso." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao encerrar sessão:", error);
    return NextResponse.json({ success: false, error: "Não foi possível encerrar a sessão." }, { status: 500 });
  }
}
