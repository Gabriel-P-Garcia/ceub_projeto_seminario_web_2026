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
      {/* Hero Section com Identidade Visual CEUB */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#19032d] via-[#120224] to-[#0d0118] border-b border-[#3c0554]/60 pt-16 pb-20 px-4">
        {/* Glow de Fundo Magenta CEUB */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#be007a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Texto Principal */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#be007a]/20 border border-[#be007a]/40 text-fuchsia-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#f43f9e]" />
              <span>Plataforma Educativa de Paleontologia • CEUB 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Explore a Vida no Mesozoico com{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f43f9e] via-[#be007a] to-[#d946ef]">
                Modelos 3D e Rigor Científico
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              DinoPédia integra anatomia tridimensional, taxonomia rigorosa e explicações adaptativas por inteligência artificial para todas as idades — no ecossistema acadêmico do CEUB.
            </p>

            {/* Chamada para Ação */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/catalogo"
                onClick={() => playSound("click")}
                className="bg-gradient-to-r from-[#be007a] to-[#7f0657] hover:from-[#d8008b] hover:to-[#be007a] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-[#be007a]/30 flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Catálogo Científico</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/especie/clw123-tyrannosaurus-rex"
                onClick={() => playSound("click")}
                className="bg-[#18032b] hover:bg-[#280540] border border-[#59107b] text-purple-100 font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 transition"
              >
                <Box className="w-4 h-4 text-[#f43f9e]" />
                <span>Visualizador 3D Anatômico</span>
              </Link>
            </div>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#3c0554]/70 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="text-2xl font-black text-[#f43f9e]">100%</span>
                <p className="text-xs text-purple-300">Fósseis Validados</p>
              </div>
              <div>
                <span className="text-2xl font-black text-fuchsia-300">&lt;300ms</span>
                <p className="text-xs text-purple-300">Latência de API</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">3 Níveis</span>
                <p className="text-xs text-purple-300">Linguagem Adaptativa</p>
              </div>
            </div>
          </div>

          {/* Destaque Visual 3D Hero */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#17032a]/90 border border-[#59107b]/70 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-[#3c0554] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦴</span>
                  <div>
                    <h3 className="font-bold text-white text-sm">Espécime em Evidência</h3>
                    <p className="text-[11px] text-[#f43f9e]">Tyrannosaurus rex (Maastrichtiano)</p>
                  </div>
                </div>
                <span className="text-[11px] bg-[#be007a]/20 text-[#f43f9e] px-2 py-0.5 rounded-full border border-[#be007a]/40 font-semibold">
                  3D Interativo
                </span>
              </div>

              {/* Prévia Artística */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c0116] via-[#1a042e] to-[#2d0545] border border-[#4a0a6a] flex flex-col items-center justify-center p-4 text-center group">
                <div className="text-7xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  🦖
                </div>
                <p className="text-xs text-purple-200 font-mono">
                  12.4m de comprimento • 8.4 toneladas
                </p>
                <p className="text-[11px] text-purple-300 mt-1 max-w-xs">
                  Crânio de 1.5m com fenestras antorbitais e músculos adutores capazes de quebrar ossos.
                </p>
                <Link
                  href="/especie/clw123-tyrannosaurus-rex"
                  className="mt-3 text-xs bg-[#be007a] hover:bg-[#d8008b] text-white font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow shadow-[#be007a]/30"
                >
                  <span>Abrir no Laboratório 3D</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Botões dos 3 Períodos Mesozoicos */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <Link
                  href="/catalogo?periodEra=Triássico"
                  className="bg-[#120224] hover:bg-[#280540] border border-[#3c0554] p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-[#f43f9e] font-bold block">TRIÁSSICO</span>
                  <span className="text-[9px] text-purple-300">252 - 201 Ma</span>
                </Link>
                <Link
                  href="/catalogo?periodEra=Jurássico"
                  className="bg-[#120224] hover:bg-[#280540] border border-[#3c0554] p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-[#f43f9e] font-bold block">JURÁSSICO</span>
                  <span className="text-[9px] text-purple-300">201 - 145 Ma</span>
                </Link>
                <Link
                  href="/catalogo?periodEra=Cretáceo"
                  className="bg-[#120224] hover:bg-[#280540] border border-[#3c0554] p-2 rounded-xl transition"
                >
                  <span className="text-[10px] text-[#f43f9e] font-bold block">CRETÁCEO</span>
                  <span className="text-[9px] text-purple-300">145 - 66 Ma</span>
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
        <div className="bg-gradient-to-r from-[#210437] via-[#150226] to-[#210437] border border-[#59107b] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <span>🇧🇷 Fósseis no Brasil</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                O Brasil como Berço Evolutivo e Santuário de Espinossauros
              </h2>
              <p className="text-sm text-purple-200/90 leading-relaxed">
                Do Rio Grande do Sul (onde viveram os dinossauros mais antigos do planeta no Triássico) até a Bacia do Araripe no Ceará e a Ilha do Cajual no Maranhão, o território brasileiro guarda fósseis excepcionais estudados por paleontólogos e pesquisadores do CEUB.
              </p>
            </div>

            <Link
              href="/catalogo?brazilOnly=true"
              onClick={() => playSound("click")}
              className="bg-gradient-to-r from-[#be007a] to-[#7f0657] hover:from-[#d8008b] hover:to-[#be007a] text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#be007a]/30 shrink-0 text-sm"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver Espécies Brasileiras</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grade de Espécies */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">Catálogo de Espécies em Evidência</h2>
              <span className="text-xs bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 px-2 py-0.5 rounded-full font-semibold">
                Nível: {ageLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-purple-300">
              O texto abaixo muda instantaneamente com o seletor pedagógico na barra superior.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="text-xs text-[#f43f9e] hover:text-white font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver todas as espécies</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-[#17032a] rounded-2xl animate-pulse border border-[#3c0554]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSpecies.map((species) => (
              <div
                key={species.id}
                className="bg-[#17032a]/85 hover:bg-[#1f0535] border border-[#3c0554] hover:border-[#be007a]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#be007a]/15 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-fuchsia-300 transition-colors">
                        {species.name}
                      </h3>
                      <span className="text-xs text-purple-300 font-mono">
                        {species.period} • {species.mya}
                      </span>
                    </div>
                    {species.brazilOccurrence && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0 font-bold">
                        🇧🇷 Brasil
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-purple-100/90 line-clamp-3 leading-relaxed mb-4">
                    {getActiveDesc(species)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3c0554] flex items-center justify-between text-[11px] text-purple-300 font-mono">
                  <div>
                    <span className="text-white font-bold">{species.length}m</span> comp. •{" "}
                    <span className="text-white font-bold">{species.diet}</span>
                  </div>

                  <Link
                    href={`/especie/${species.id}`}
                    onClick={() => playSound("click")}
                    className="bg-[#280540] hover:bg-[#be007a] text-purple-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition flex items-center gap-1"
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

      {/* Módulos do Sistema */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-black text-white mb-6">Módulos Interativos Integrados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/paleoecologia"
            onClick={() => playSound("click")}
            className="bg-[#17032a] border border-[#3c0554] hover:border-[#be007a]/60 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-[#be007a]/15 rounded-xl w-fit border border-[#be007a]/30 text-[#f43f9e] mb-4 group-hover:scale-110 transition-transform">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors mb-2">
              Módulo Paleoecológico
            </h3>
            <p className="text-xs text-purple-300/80 leading-relaxed">
              Explore o mapa da Deriva Continental (Pangeia até a fragmentação moderna) e simule cadeias tróficas e eventos de extinção em massa.
            </p>
          </Link>

          <Link
            href="/quiz"
            onClick={() => playSound("click")}
            className="bg-[#17032a] border border-[#3c0554] hover:border-[#be007a]/60 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-[#be007a]/15 rounded-xl w-fit border border-[#be007a]/30 text-[#f43f9e] mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors mb-2">
              Quizzes & Gamificação
            </h3>
            <p className="text-xs text-purple-300/80 leading-relaxed">
              Teste seus conhecimentos com 3 modos de jogo, streaks de acertos, badges colecionáveis e perguntas calibradas para o seu nível pedagógico.
            </p>
          </Link>

          <Link
            href="/forum"
            onClick={() => playSound("click")}
            className="bg-[#17032a] border border-[#3c0554] hover:border-[#be007a]/60 p-6 rounded-2xl group transition"
          >
            <div className="p-3 bg-[#be007a]/15 rounded-xl w-fit border border-[#be007a]/30 text-[#f43f9e] mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors mb-2">
              Fórum & Curadoria RBAC
            </h3>
            <p className="text-xs text-purple-300/80 leading-relaxed">
              Comunidade científica com papéis diferenciados (Aluno, Professor, Curador, Admin) e sincronização ao vivo com a base de dados global PBDB.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
