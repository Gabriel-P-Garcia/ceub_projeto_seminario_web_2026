"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore, AgeLevel, UserRole } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  Compass,
  BookOpen,
  Box,
  Globe2,
  Trophy,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Flame,
  SunMoon,
  Type,
  Menu,
  X,
  User,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const {
    ageLevel,
    setAgeLevel,
    userRole,
    setUserRole,
    score,
    streak,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
  } = useAppStore();

  const navLinks = [
    { href: "/", label: "Início", icon: Compass },
    { href: "/catalogo", label: "Catálogo Científico", icon: BookOpen },
    { href: "/especie/clw123-tyrannosaurus-rex", label: "Anatomia 3D", icon: Box },
    { href: "/paleoecologia", label: "Deriva & Ecossistemas", icon: Globe2 },
    { href: "/quiz", label: "Quizzes", icon: Trophy },
    { href: "/forum", label: "Fórum", icon: MessageSquare },
    { href: "/curadoria", label: "Curadoria", icon: ShieldCheck },
  ];

  const ageOptions: { id: AgeLevel; label: string; icon: string; desc: string }[] = [
    { id: "infantil", label: "Infantil", icon: "🧒", desc: "6-10 anos: Linguagem lúdica e visual" },
    { id: "escolar", label: "Escolar", icon: "🎒", desc: "11-17 anos: Conceitos biológicos e evolução" },
    { id: "academico", label: "Acadêmico", icon: "🔬", desc: "Superior: Cladística e osteologia rigorosa" },
  ];

  const roles: UserRole[] = ["Aluno", "Professor", "Paleontólogo Curador", "Administrador"];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-amber-950/40 text-slate-100 transition-colors">
      {/* Top Banner de Acessibilidade & Gamificação */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-b border-amber-900/30 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Status Educacional CEUB 2026 */}
          <div className="flex items-center gap-2 text-amber-300 font-medium overflow-hidden whitespace-nowrap">
            <span className="hidden sm:inline bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-amber-500/30">
              Projeto CEUB 2026
            </span>
            <span className="truncate">DinoPédia • Plataforma Interativa de Paleontologia e Biologia</span>
          </div>

          {/* Ferramentas de Acessibilidade e Perfil RBAC */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Gamificação Bar */}
            <div className="flex items-center gap-2.5 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-amber-900/40">
              <span className="flex items-center gap-1 text-amber-400 font-bold" title="Pontos de Conhecimento Paleontológico">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {score} pts
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-orange-400 font-bold" title="Sequência diária de estudos">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                {streak}x
              </span>
            </div>

            {/* Alternar Alto Contraste */}
            <button
              onClick={() => {
                toggleHighContrast();
                playSound("click");
              }}
              className={`p-1 rounded-md transition ${
                highContrast
                  ? "bg-amber-400 text-black font-bold"
                  : "text-slate-400 hover:text-amber-300 hover:bg-slate-800"
              }`}
              title="Alternar Modo de Alto Contraste (WCAG 2.1 AA)"
              aria-label="Alto Contraste"
            >
              <SunMoon className="w-3.5 h-3.5" />
            </button>

            {/* Alternar Tamanho de Fonte */}
            <button
              onClick={() => {
                const nextSize = fontSize === "normal" ? "large" : fontSize === "large" ? "extra-large" : "normal";
                setFontSize(nextSize);
                playSound("click");
              }}
              className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-md transition flex items-center gap-0.5"
              title="Ajustar Tamanho da Fonte (A- / A+)"
              aria-label="Tamanho de Fonte"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">
                {fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}
              </span>
            </button>

            {/* Seletor de Perfil RBAC (Aluno, Professor, Curador, Admin) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1 text-[11px] bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded-full text-slate-300 transition"
              >
                <User className="w-3 h-3 text-amber-400" />
                <span className="font-semibold text-amber-200">{userRole}</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-amber-900/40 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-semibold">
                    Alternar Perfil (RBAC)
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setRoleMenuOpen(false);
                        playSound("click");
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                        userRole === r
                          ? "bg-amber-600 text-white font-medium"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => playSound("click")}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-0.5 shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🦕</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Dino<span className="text-amber-500">Pédia</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-1 hidden sm:block">
              Paleobiologia & Evolução
            </p>
          </div>
        </Link>

        {/* Chave Seletora de Faixa Etária (ADR-002) - Elemento Central de Destaque */}
        <div className="hidden lg:flex items-center bg-slate-900/90 border border-amber-900/40 p-1 rounded-2xl shadow-inner">
          <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
            Modo Didático:
          </span>
          {ageOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setAgeLevel(opt.id);
                playSound("click");
              }}
              title={opt.desc}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                ageLevel === opt.id
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/40 scale-105"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("/")[1] ? `/${link.href.split("/")[1]}` : link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playSound("click")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Age Switcher icon */}
          <button
            onClick={() => {
              const nextAge: AgeLevel =
                ageLevel === "infantil"
                  ? "escolar"
                  : ageLevel === "escolar"
                  ? "academico"
                  : "infantil";
              setAgeLevel(nextAge);
              playSound("click");
            }}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-sm"
            title="Alternar Faixa Etária"
          >
            {ageLevel === "infantil" ? "🧒" : ageLevel === "escolar" ? "🎒" : "🔬"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-4">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold block mb-2">
              Selecione o Nível Pedagógico (ADR-002):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {ageOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setAgeLevel(opt.id);
                    playSound("click");
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition ${
                    ageLevel === opt.id
                      ? "bg-amber-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    playSound("click");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
