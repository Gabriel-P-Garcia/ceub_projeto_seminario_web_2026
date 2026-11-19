import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DinoPédia — Plataforma Educativa e Interativa de Paleontologia e Biologia",
  description:
    "Catálogo interativo de espécies de dinossauros, visualizador 3D de anatomia e fósseis, linhas do tempo geológicas, explicações adaptativas por inteligência artificial e quizzes gamificados. CEUB 2026.",
  keywords: [
    "DinoPédia",
    "Paleontologia",
    "Dinossauros",
    "Fósseis",
    "3D",
    "React Three Fiber",
    "Evolução",
    "Biologia",
    "CEUB",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
