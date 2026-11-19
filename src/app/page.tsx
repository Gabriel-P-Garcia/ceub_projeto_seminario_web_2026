"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import AIExplainerBox from "@/components/ai/AIExplainerBox";
import {
  Compass,
  BookOpen,
  Box,
  Globe2,
  Trophy,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface SpeciesData {
  id: string;
  name: string;
  period: string;
  periodEra: string;
  mya: string;
  clade: string;
  diet: string;
  length: number;
  weight: number;
  brazilOccurrence: boolean;
  descInfantil: string;
  descEscolar: string;
  descAcademica: string;
  funFact: string;
  colorTheme: string;
  modelType: string;
}

export default function HomePage() {
  const { ageLevel } = useAppStore();
  const [featuredSpecies, setFeaturedSpecies] = useState<SpeciesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/species");
        const json = await res.json();
        if (json.success && json.data) {
          setFeaturedSpecies(json.data.slice(0, 6));
        }
      } catch (e) {
        console.error("Erro ao carregar espécies:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getActiveDesc = (s: SpeciesData) => {
    if (ageLevel === "infantil") return s.descInfantil;
    if (ageLevel === "academico") return s.descAcademica;
    return s.descEscolar;
  };

  return (
    <div className="w-full space-y-16 pb-16">
      {/* Hero Section com Estética de Expedição e Paleobiologia */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-amber-900/30 pt-16 pb-20 px-4">
        {/* Glow de Fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plataforma Educativa de Paleontologia • CEUB 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Explore a Vida no Mesozoico com{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                Modelos 3D e Rigor Científico
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              DinoPédia integra anatomia tridimensional, taxonomia rigorosa e explicações adaptativas por inteligência artificial para todas as idades — de crianças a pesquisadores de biologia.
            </p>

            {/* Chamada para Ação */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/catalogo"
                onClick={() => playSound("click")}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-900/40 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Catálogo Científico</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/especie/clw123-tyrannosaurus-rex"
                onClick={() => playSound("click")}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 transition"
              >
                <Box className="w-4 h-4 text-amber-400" />
                <span>Visualizador 3D Anatômico</span>
              </Link>
            </div>

            {/* Métricas Rápidas do Sistema */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="text-2xl font-black text-amber-400">100%</span>
                <p className="text-xs text-slate-400">Fósseis Validados</p>
              </div>
              <div>
                <span className="text-2xl font-black text-sky-400">&lt;300ms</span>
                <p className="text-xs text-slate-400">Latência de API</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">3 Níveis</span>
                <p className="text-xs text-slate-400">Linguagem Adaptativa</p>
              </div>
            </div>
          </div>

          {/* Destaque Visual Interativo 3D Hero */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-900/90 border border-amber-900/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦴</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">Espécime em Evidência</h3>
                    <p className="text-[11px] text-amber-400">Tyrannosaurus rex (Maastrichtiano)</p>
                  </div>
                </div>
                <span className="text-[11px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  3D Interativo
                </span>
              </div>

              {/* Prévia Artística & Estrutural */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 flex flex-col items-center justify-center p-4 text-center group">
                <div className="text-7xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  🦖
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  12.4m de comprimento • 8.4 toneladas
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Crânio de 1.5m com fenestras antorbitais e músculos adutores capazes de quebrar ossos.
                </p>
                <Link
                  href="/especie/clw123-tyrannosaurus-rex"
                  className="mt-3 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
                >
                  <span>Abrir no Laboratório 3D</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Botões dos 3 Períodos da Era Mesozoica */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <Link
                  href="/catalogo?periodEra=Triássico"
                  className="bg-slate-950 hover:bg-amber-950/60 border border-amber-900/40 p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-amber-400 font-bold block">TRIÁSSICO</span>
                  <span className="text-[9px] text-slate-400">252 - 201 Ma</span>
                </Link>
                <Link
                  href="/catalogo?periodEra=Jurássico"
                  className="bg-slate-950 hover:bg-amber-950/60 border border-amber-900/40 p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-amber-400 font-bold block">JURÁSSICO</span>
                  <span className="text-[9px] text-slate-400">201 - 145 Ma</span>
                </Link>
                <Link
                  href="/catalogo?periodEra=Cretáceo"
                  className="bg-slate-950 hover:bg-amber-950/60 border border-amber-900/40 p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-amber-400 font-bold block">CRETÁCEO</span>
                  <span className="text-[9px] text-slate-400">145 - 66 Ma</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Caixa de IA Adaptativa */}
      <section className="max-w-7xl mx-auto px-4">
        <AIExplainerBox />
      </section>

      {/* Destaque Paleontológico do Brasil */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/50 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <span>🇧🇷 Fósseis no Brasil</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                O Brasil como Berço Evolutivo e Santuário de Espinossauros
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Do Rio Grande do Sul (onde viveram os dinossauros mais antigos do planeta no Triássico) até a Bacia do Araripe no Ceará e a Ilha do Cajual no Maranhão, o território brasileiro guarda fósseis excepcionais com preservação de tecidos moles e crânios intactos.
              </p>
            </div>

            <Link
              href="/catalogo?brazilOnly=true"
              onClick={() => playSound("click")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-950 shrink-0 text-sm"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver Espécies Brasileiras</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grade de Espécies do Catálogo Dinâmico (Adaptativo ADR-002) */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">Catálogo de Espécies em Evidência</h2>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                Nível: {ageLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              O texto abaixo muda instantaneamente com o seletor pedagógico na barra superior.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver todas as espécies</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpecies.map((species) => (
              <div
                key={species.id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-amber-950/40 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/30 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                        {species.name}
                      </h3>
                      <span className="text-xs text-amber-400/90 font-mono">
                        {species.period} • {species.mya}
                      </span>
                    </div>
                    {species.brazilOccurrence && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 font-bold">
                        🇧🇷 Brasil
                      </span>
                    )}
                  </div>

                  {/* Descrição que se adapta à idade ativa */}
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {getActiveDesc(species)}
                  </p>
                </div>

                {/* Métricas e Botão */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-200 font-bold">{species.length}m</span> comp. •{" "}
                    <span className="text-slate-200 font-bold">{species.diet}</span>
                  </div>

                  <Link
                    href={`/especie/${species.id}`}
                    onClick={() => playSound("click")}
                    className="bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Ver em 3D</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Módulos do Sistema de Acordo com a Arquitetura */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-white mb-6">Módulos Interativos Integrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo 1: Deriva & Teias Alimentares */}
          <Link
            href="/paleoecologia"
            onClick={() => playSound("click")}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-amber-500/10 rounded-xl w-fit border border-amber-500/30 text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
              Módulo Paleoecológico
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore o mapa da Deriva Continental (Pangeia até a fragmentação moderna) e simule cadeias tróficas e eventos de extinção em massa.
            </p>
          </Link>

          {/* Módulo 2: Quizzes & Gamificação */}
          <Link
            href="/quiz"
            onClick={() => playSound("click")}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-orange-500/10 rounded-xl w-fit border border-orange-500/30 text-orange-400 mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
              Quizzes & Gamificação
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teste seus conhecimentos com 3 modos de jogo, streaks de acertos, badges colecionáveis e perguntas calibradas para o seu nível pedagógico.
            </p>
          </Link>

          {/* Módulo 3: Fórum e Curadoria */}
          <Link
            href="/forum"
            onClick={() => playSound("click")}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-sky-500/10 rounded-xl w-fit border border-sky-500/30 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
              Fórum & Curadoria RBAC
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comunidade científica com papéis diferenciados (Aluno, Professor, Curador, Admin) e sincronização ao vivo com a base de dados global PBDB.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
