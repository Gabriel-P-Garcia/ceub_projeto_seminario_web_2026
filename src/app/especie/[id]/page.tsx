"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppStore, AgeLevel } from "@/lib/store";
import { playSound, speakText } from "@/lib/sound";
import Dinosaur3DViewer from "@/components/3d/Dinosaur3DViewer";
import AIExplainerBox from "@/components/ai/AIExplainerBox";
import {
  ArrowLeft,
  Volume2,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
  Activity,
  Shield,
  BookOpen,
  Box,
  Compass,
} from "lucide-react";

interface Species {
  id: string;
  name: string;
  pronunciation: string;
  meaning: string;
  period: string;
  periodEra: string;
  mya: string;
  clade: string;
  family: string;
  diet: string;
  habit: string;
  length: number;
  height: number;
  weight: number;
  speed: number;
  discoveryYear: number;
  discoverer: string;
  fossilLocations: string;
  brazilOccurrence: boolean;
  descInfantil: string;
  descEscolar: string;
  descAcademica: string;
  funFact: string;
  dietDetails: string;
  skeletonNotes: string;
  muscleNotes: string;
  integumentNotes: string;
  modelType: string;
  colorTheme: string;
}

export default function SpeciesDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { ageLevel, setAgeLevel } = useAppStore();

  const [species, setSpecies] = useState<Species | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpecies() {
      setLoading(true);
      try {
        const res = await fetch(`/api/species/${id}`);
        const json = await res.json();
        if (json.success) {
          setSpecies(json.data);
          setRelated(json.related || []);
        } else {
          // Se não encontrou por ID exato, buscar a primeira espécie como fallback
          const allRes = await fetch("/api/species");
          const allJson = await allRes.json();
          if (allJson.success && allJson.data.length > 0) {
            setSpecies(allJson.data[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadSpecies();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-medium">Carregando dados paleontológicos...</p>
      </div>
    );
  }

  if (!species) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Espécime fóssil não localizado</h2>
        <Link
          href="/catalogo"
          className="text-amber-400 hover:text-amber-300 font-semibold text-sm inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const currentDesc =
    ageLevel === "infantil"
      ? species.descInfantil
      : ageLevel === "academico"
      ? species.descAcademica
      : species.descEscolar;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Navegação Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/catalogo"
          onClick={() => playSound("click")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Catálogo Científico</span>
        </Link>

        {/* Chave Seletora Rápida de Nível Pedagógico (ADR-002) */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <span className="text-slate-400 px-2 font-medium">Modo Didático:</span>
          {(["infantil", "escolar", "academico"] as AgeLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setAgeLevel(lvl);
                playSound("click");
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition ${
                ageLevel === lvl
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {lvl === "infantil" ? "🧒 Infantil" : lvl === "escolar" ? "🎒 Escolar" : "🔬 Acadêmico"}
            </button>
          ))}
        </div>
      </div>

      {/* Cabeçalho da Espécie */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
            {species.periodEra} ({species.mya})
          </span>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
            Clado {species.clade}
          </span>
          {species.brazilOccurrence && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
              🇧🇷 Registro Paleontológico no Brasil
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
          <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tight">
            {species.name}
          </h1>
          <span className="text-sm text-slate-400 font-mono">
            [{species.pronunciation}]
          </span>
        </div>

        <p className="text-sm text-amber-300/80 font-serif italic">
          Significado etimológico: &quot;{species.meaning}&quot;
        </p>
      </div>

      {/* Visualizador 3D Interativo (ADR-001) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-amber-500" />
              Laboratório Anatômico 3D
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              (Use o mouse/toque para girar, aplicar zoom e alternar camadas)
            </span>
          </div>
        </div>

        <Dinosaur3DViewer
          speciesName={species.name}
          modelType={species.modelType}
          lengthMeters={species.length}
          heightMeters={species.height}
          skeletonNotes={species.skeletonNotes}
          muscleNotes={species.muscleNotes}
          integumentNotes={species.integumentNotes}
        />
      </section>

      {/* Caixa de Explicação Adaptativa (ADR-002) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Explicação Didática • Nível {ageLevel.toUpperCase()}
            </h3>
          </div>

          <button
            onClick={() => {
              speakText(currentDesc);
              playSound("click");
            }}
            className="text-xs text-slate-300 hover:text-amber-400 flex items-center gap-1.5 transition bg-slate-800 px-3 py-1.5 rounded-lg"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Ouvir Texto</span>
          </button>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {currentDesc}
        </p>

        {species.funFact && (
          <div className="bg-amber-950/40 border border-amber-800/40 p-3.5 rounded-xl text-xs text-amber-200">
            <span className="font-bold block mb-1">💡 Curiosidade Paleontológica:</span>
            {species.funFact}
          </div>
        )}
      </div>

      {/* Detalhes de Biometria e Fisiologia */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">Comprimento</span>
          <span className="text-2xl font-black text-amber-400">{species.length}m</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">Altura</span>
          <span className="text-2xl font-black text-amber-400">{species.height}m</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">Massa Estimada</span>
          <span className="text-2xl font-black text-amber-400">
            {species.weight >= 1000 ? `${(species.weight / 1000).toFixed(1)} t` : `${species.weight} kg`}
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 block mb-1">Velocidade Máx.</span>
          <span className="text-2xl font-black text-amber-400">{species.speed} km/h</span>
        </div>
      </div>

      {/* Notas Anatômicas Especializadas por Camada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🦴</span> Osteologia (Esqueleto)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{species.skeletonNotes}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🥩</span> Miologia (Musculatura)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{species.muscleNotes}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🦎</span> Tegumento (Pele & Penas)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">{species.integumentNotes}</p>
        </div>
      </div>

      {/* Histórico da Descoberta & Registro Fóssil */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500" />
          Registro Estratigráfico e Descoberta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Ano da Descoberta:</span>
            <span className="text-slate-200 font-bold">{species.discoveryYear}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Descobridor / Equipe:</span>
            <span className="text-slate-200 font-bold">{species.discoverer}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Formação & Local:</span>
            <span className="text-slate-200 font-bold">{species.fossilLocations}</span>
          </div>
        </div>
      </div>

      {/* Caixa de IA Específica da Espécie */}
      <AIExplainerBox initialSpeciesName={species.name} />

      {/* Espécies Relacionadas */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-base font-bold text-white">Espécies Paleontologicamente Relacionadas</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/especie/${rel.id}`}
                onClick={() => playSound("click")}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500 p-4 rounded-xl text-xs block transition group"
              >
                <span className="text-white font-bold group-hover:text-amber-400 block mb-1">
                  {rel.name}
                </span>
                <span className="text-slate-400 block text-[11px]">{rel.periodEra} • {rel.clade}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
