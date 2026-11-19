"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0d0118]/90 border-b border-[#3c0554]/60 text-slate-100 transition-colors">
      {/* Top Banner Institucional CEUB */}
      <div className="bg-gradient-to-r from-[#1f032e] via-[#3c0554] to-[#1f032e] border-b border-[#5a0c7c]/40 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo e Identidade CEUB */}
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="bg-white/95 px-2 py-0.5 rounded shadow-sm flex items-center shrink-0">
              <img
                src="/ceub-logo.png"
                alt="CEUB Logo"
                className="h-4 w-auto object-contain"
              />
            </div>
            <span className="hidden sm:inline bg-[#be007a]/25 text-fuchsia-200 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border border-[#be007a]/40">
              Seminário Web 2026
            </span>
            <span className="text-purple-200 text-xs truncate">
              DinoPédia • Plataforma Interativa de Paleontologia e Biologia
            </span>
          </div>

          {/* Ferramentas de Acessibilidade e Perfil RBAC */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Gamificação Bar */}
            <div className="flex items-center gap-2 bg-[#120224] px-2.5 py-0.5 rounded-full border border-[#59107b]/50">
              <span className="flex items-center gap-1 text-[#f43f9e] font-bold" title="Pontos de Conhecimento Paleontológico">
                <Sparkles className="w-3.5 h-3.5 text-[#f43f9e]" />
                {score} pts
              </span>
              <span className="text-purple-800">|</span>
              <span className="flex items-center gap-1 text-fuchsia-300 font-bold" title="Sequência diária de estudos">
                <Flame className="w-3.5 h-3.5 text-[#be007a] animate-pulse" />
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
                  ? "bg-[#be007a] text-white font-bold"
                  : "text-purple-300 hover:text-white hover:bg-[#3c0554]"
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
              className="p-1 text-purple-300 hover:text-white hover:bg-[#3c0554] rounded-md transition flex items-center gap-0.5"
              title="Ajustar Tamanho da Fonte (A- / A+)"
              aria-label="Tamanho de Fonte"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">
                {fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}
              </span>
            </button>

            {/* Seletor de Perfil RBAC */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1 text-[11px] bg-[#120224] hover:bg-[#280540] border border-[#59107b]/60 px-2.5 py-0.5 rounded-full text-purple-200 transition"
              >
                <User className="w-3 h-3 text-[#f43f9e]" />
                <span className="font-semibold text-white">{userRole}</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-[#16022c] border border-[#59107b] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
                  <div className="px-2 py-1 text-[10px] text-purple-300 uppercase font-semibold">
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
                          ? "bg-[#be007a] text-white font-medium"
                          : "text-purple-200 hover:bg-[#2b0646]"
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
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#be007a] via-[#85085e] to-[#3c0554] p-0.5 shadow-lg shadow-[#be007a]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#120224] rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🦕</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-fuchsia-300 transition-colors">
                Dino<span className="text-[#be007a]">Pédia</span>
              </span>
              <span className="text-[10px] bg-[#be007a]/15 text-[#f43f9e] border border-[#be007a]/30 px-1.5 py-0.2 rounded font-mono font-bold">
                CEUB
              </span>
            </div>
            <p className="text-[11px] text-purple-300 -mt-1 hidden sm:block">
              Paleobiologia & Evolução
            </p>
          </div>
        </Link>

        {/* Chave Seletora de Faixa Etária (ADR-002) */}
        <div className="hidden lg:flex items-center bg-[#150228] border border-[#4a0a6a] p-1 rounded-2xl shadow-inner">
          <span className="text-[11px] text-purple-300 font-semibold px-2 flex items-center gap-1">
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
                  ? "bg-gradient-to-r from-[#be007a] to-[#7f0657] text-white shadow-md shadow-[#be007a]/40 scale-105"
                  : "text-purple-200 hover:text-white hover:bg-[#2d0549]"
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
                    ? "bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 font-semibold"
                    : "text-purple-200 hover:text-white hover:bg-[#25043d]"
                }`}
              >
                <Icon className="w-4 h-4 text-[#be007a]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
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
            className="p-2 bg-[#1b0333] border border-[#59107b] rounded-xl text-sm"
            title="Alternar Faixa Etária"
          >
            {ageLevel === "infantil" ? "🧒" : ageLevel === "escolar" ? "🎒" : "🔬"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-purple-200 hover:text-white hover:bg-[#25043d] rounded-xl"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#3c0554] bg-[#0d0118] p-4 space-y-4">
          <div className="bg-[#17032a] p-3 rounded-2xl border border-[#4a0a6a]">
            <span className="text-xs text-purple-300 font-semibold block mb-2">
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
                      ? "bg-[#be007a] text-white"
                      : "bg-[#280540] text-purple-200 hover:bg-[#3c0760]"
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
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-[#17032a] border border-[#3c0554] text-purple-200 hover:bg-[#280540]"
                >
                  <Icon className="w-4 h-4 text-[#be007a]" />
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
