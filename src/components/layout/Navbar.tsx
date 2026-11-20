"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Compass, LogIn, Menu, MessageSquare, SunMoon, Trophy, Type, User, X } from "lucide-react";
import { AgeLevel, useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";

const navLinks = [
  { href: "/", label: "Início", icon: Compass },
  { href: "/catalogo", label: "Catálogo", icon: BookOpen },
  { href: "/quiz", label: "Quizzes", icon: Trophy },
  { href: "/forum", label: "Fórum", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const { ageLevel, setAgeLevel, highContrast, toggleHighContrast, fontSize, setFontSize } = useAppStore();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Falha ao consultar sessão");
        return response.json();
      })
      .then((result) => setUser(result.user))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setUser(null);
      });

    return () => controller.abort();
  }, [pathname]);

  async function logout() {
    try {
      const response = await fetch("/api/auth", { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao encerrar sessão");
      setUser(null);
      playSound("click");
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  }

  function cycleAgeLevel() {
    const levels: AgeLevel[] = ["infantil", "escolar", "academico"];
    setAgeLevel(levels[(levels.indexOf(ageLevel) + 1) % levels.length]);
    playSound("click");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#3c0554]/70 bg-[#0d0118]/95 text-slate-100 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" onClick={() => playSound("click")} className="flex shrink-0 items-center gap-2 text-xl font-black tracking-tight text-white">
          <Image src="/dinosaur-trex.svg" alt="Tiranossauro Rex" width={32} height={32} className="h-8 w-8" priority />
          Dino<span className="text-[#be007a]">Pédia</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} onClick={() => playSound("click")} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition ${isActive ? "bg-[#be007a]/20 font-semibold text-[#f43f9e]" : "text-purple-200 hover:bg-[#25043d] hover:text-white"}`}>
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={cycleAgeLevel} title="Alternar nível pedagógico" className="hidden rounded-lg border border-[#59107b] px-2 py-1.5 text-xs text-purple-200 hover:bg-[#3c0554] sm:block">
            <span className="hidden lg:inline">{ageLevel}</span>
          </button>
          <button onClick={() => { toggleHighContrast(); playSound("click"); }} title="Alternar alto contraste" className={`rounded-lg p-2 transition ${highContrast ? "bg-[#be007a] text-white" : "text-purple-300 hover:bg-[#3c0554] hover:text-white"}`}>
            <SunMoon className="h-4 w-4" />
          </button>
          <button onClick={() => { setFontSize(fontSize === "normal" ? "large" : fontSize === "large" ? "extra-large" : "normal"); playSound("click"); }} title="Ajustar tamanho da fonte" className="hidden items-center gap-1 rounded-lg p-2 text-purple-300 hover:bg-[#3c0554] hover:text-white sm:flex">
            <Type className="h-4 w-4" /><span className="text-xs font-bold">{fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}</span>
          </button>
          {user ? (
            <button onClick={logout} title="Sair" className="flex items-center gap-1.5 rounded-xl border border-[#59107b] px-2.5 py-1.5 text-xs text-purple-100 hover:border-[#be007a]">
              <User className="h-4 w-4 text-[#f43f9e]" /><span className="hidden max-w-24 truncate sm:inline">{user.name}</span>
            </button>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 rounded-xl bg-[#be007a] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d8008b]">
              <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 text-purple-200 hover:bg-[#25043d] md:hidden" aria-label="Abrir menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#3c0554] bg-[#0d0118] px-4 py-3 md:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 rounded-xl border border-[#3c0554] bg-[#17032a] p-3 text-sm text-purple-200 hover:bg-[#280540]"><Icon className="h-4 w-4 text-[#be007a]" />{link.label}</Link>;
            })}
          </nav>
          <button onClick={cycleAgeLevel} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#59107b] p-2 text-sm text-purple-200">Nível: {ageLevel} <ChevronDown className="h-4 w-4" /></button>
        </div>
      )}
    </header>
  );
}
