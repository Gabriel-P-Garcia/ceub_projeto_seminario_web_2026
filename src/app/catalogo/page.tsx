"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  Search,
  Filter,
  Box,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
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
  modelType: string;
  colorTheme: string;
}

function CatalogoContent() {
  const searchParams = useSearchParams();
  const { ageLevel } = useAppStore();

  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEra, setSelectedEra] = useState<string>(searchParams.get("periodEra") || "all");
  const [selectedDiet, setSelectedDiet] = useState<string>("all");
  const [selectedClade, setSelectedClade] = useState<string>("all");
  const [brazilOnly, setBrazilOnly] = useState<boolean>(searchParams.get("brazilOnly") === "true");
  const [sortBy, setSortBy] = useState<"name" | "length" | "weight" | "mya">("name");

  useEffect(() => {
    async function fetchSpecies() {
      setLoading(true);
      try {
        const res = await fetch("/api/species");
        const json = await res.json();
        if (json.success) {
          setSpeciesList(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecies();
  }, []);

  const filteredSpecies = useMemo(() => {
    return speciesList
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.fossilLocations.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.discoverer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEra = selectedEra === "all" || s.periodEra === selectedEra;
        const matchesDiet = selectedDiet === "all" || s.diet === selectedDiet;
        const matchesClade = selectedClade === "all" || s.clade === selectedClade;
        const matchesBrazil = !brazilOnly || s.brazilOccurrence;

        return matchesSearch && matchesEra && matchesDiet && matchesClade && matchesBrazil;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "length") return b.length - a.length;
        if (sortBy === "weight") return b.weight - a.weight;
        return a.name.localeCompare(b.name);
      });
  }, [speciesList, searchTerm, selectedEra, selectedDiet, selectedClade, brazilOnly, sortBy]);

  const getAgeDescription = (s: Species) => {
    if (ageLevel === "infantil") return s.descInfantil;
    if (ageLevel === "academico") return s.descAcademica;
    return s.descEscolar;
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedEra("all");
    setSelectedDiet("all");
    setSelectedClade("all");
    setBrazilOnly(false);
    playSound("click");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header do Catálogo */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#3c0554] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-white">Catálogo Científico Dinâmico</h1>
            <span className="bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredSpecies.length} {filteredSpecies.length === 1 ? "táxon" : "táxons"}
            </span>
          </div>
          <p className="text-sm text-purple-300">
            Fichas taxonômicas com triplas de linguagem adaptativas (ADR-002) e laboratório 3D CEUB.
          </p>
        </div>

        {/* Nível Ativo Indicador */}
        <div className="flex items-center gap-2 bg-[#17032a] border border-[#4a0a6a] px-3 py-1.5 rounded-xl text-xs">
          <span className="text-purple-300">Modo de Leitura:</span>
          <span className="text-[#f43f9e] font-bold uppercase">
            {ageLevel === "infantil" ? "🧒 Infantil" : ageLevel === "escolar" ? "🎒 Escolar" : "🔬 Acadêmico"}
          </span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#17032a]/90 border border-[#3c0554] rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome científico, clado, descobridor, formação rochosa..."
            className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-purple-400/50 focus:outline-none focus:border-[#be007a]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-purple-300 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-purple-300 font-semibold block mb-1">Período:</label>
            <select
              value={selectedEra}
              onChange={(e) => {
                setSelectedEra(e.target.value);
                playSound("click");
              }}
              className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-lg p-2 text-purple-200 focus:outline-none focus:border-[#be007a]"
            >
              <option value="all">Todos os Períodos</option>
              <option value="Triássico">Triássico (252-201 Ma)</option>
              <option value="Jurássico">Jurássico (201-145 Ma)</option>
              <option value="Cretáceo">Cretáceo (145-66 Ma)</option>
            </select>
          </div>

          <div>
            <label className="text-purple-300 font-semibold block mb-1">Dieta:</label>
            <select
              value={selectedDiet}
              onChange={(e) => {
                setSelectedDiet(e.target.value);
                playSound("click");
              }}
              className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-lg p-2 text-purple-200 focus:outline-none focus:border-[#be007a]"
            >
              <option value="all">Todas as Dietas</option>
              <option value="Carnívoro">Carnívoro</option>
              <option value="Herbívoro">Herbívoro</option>
              <option value="Piscívoro">Piscívoro</option>
            </select>
          </div>

          <div>
            <label className="text-purple-300 font-semibold block mb-1">Clado:</label>
            <select
              value={selectedClade}
              onChange={(e) => {
                setSelectedClade(e.target.value);
                playSound("click");
              }}
              className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-lg p-2 text-purple-200 focus:outline-none focus:border-[#be007a]"
            >
              <option value="all">Todos os Clados</option>
              <option value="Theropoda">Theropoda</option>
              <option value="Sauropodomorpha">Sauropodomorpha</option>
              <option value="Ornithischia">Ornithischia</option>
              <option value="Pterosauria">Pterosauria</option>
            </select>
          </div>

          <div>
            <label className="text-purple-300 font-semibold block mb-1">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                playSound("click");
              }}
              className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-lg p-2 text-purple-200 focus:outline-none focus:border-[#be007a]"
            >
              <option value="name">Nome (A - Z)</option>
              <option value="length">Comprimento (Maior)</option>
              <option value="weight">Peso (Mais pesado)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setBrazilOnly(!brazilOnly);
                playSound("click");
              }}
              className={`w-full py-2 px-3 rounded-lg border font-semibold transition flex items-center justify-center gap-1.5 ${
                brazilOnly
                  ? "bg-[#be007a] text-white border-[#f43f9e] shadow-md shadow-[#be007a]/30"
                  : "bg-[#0c0116] text-purple-200 border-[#4a0a6a] hover:bg-[#280540]"
              }`}
            >
              <span>🇧🇷</span>
              <span>Apenas Brasil</span>
            </button>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-2 px-3 rounded-lg border border-[#4a0a6a] bg-[#0c0116] hover:bg-[#280540] text-purple-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grade de Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-[#17032a] rounded-2xl animate-pulse border border-[#3c0554]" />
          ))}
        </div>
      ) : filteredSpecies.length === 0 ? (
        <div className="bg-[#17032a]/60 border border-[#3c0554] rounded-2xl p-12 text-center space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-lg font-bold text-white">Nenhuma espécie encontrada</h3>
          <p className="text-xs text-purple-300 max-w-sm mx-auto">
            Tente remover alguns filtros ou buscar por termos mais amplos (ex: &quot;Theropoda&quot;, &quot;Brasil&quot;, &quot;Cretáceo&quot;).
          </p>
          <button
            onClick={resetFilters}
            className="text-xs bg-[#be007a] hover:bg-[#d8008b] text-white font-medium px-4 py-2 rounded-xl transition"
          >
            Restaurar Catálogo Completo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((species) => (
            <div
              key={species.id}
              className="bg-[#17032a]/85 hover:bg-[#1f0535] border border-[#3c0554] hover:border-[#be007a]/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#be007a]/20 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">
                      {species.name}
                    </h3>
                    <p className="text-[11px] text-purple-300/80 italic font-serif">
                      &quot;{species.meaning}&quot;
                    </p>
                  </div>

                  {species.brazilOccurrence && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                      🇧🇷 Brasil
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 px-2 py-0.5 rounded-md font-semibold">
                    {species.periodEra}
                  </span>
                  <span className="bg-[#280540] text-purple-200 px-2 py-0.5 rounded-md">
                    {species.clade}
                  </span>
                  <span className="bg-[#280540] text-purple-200 px-2 py-0.5 rounded-md">
                    {species.diet}
                  </span>
                </div>

                <div className="bg-[#0c0116]/80 border border-[#3c0554] rounded-xl p-3">
                  <span className="text-[10px] text-[#f43f9e] uppercase tracking-wider font-bold block mb-1">
                    Explicação ({ageLevel}):
                  </span>
                  <p className="text-xs text-purple-100 leading-relaxed line-clamp-4">
                    {getAgeDescription(species)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-purple-300">
                  <MapPin className="w-3.5 h-3.5 text-[#be007a] shrink-0" />
                  <span className="truncate">{species.fossilLocations}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#3c0554] flex items-center justify-between">
                <div className="text-[11px] font-mono text-purple-300">
                  <span className="text-white font-bold">{species.length}m</span> comp •{" "}
                  <span className="text-white font-bold">
                    {(species.weight / 1000).toFixed(1)}t
                  </span>
                </div>

                <Link
                  href={`/especie/${species.id}`}
                  onClick={() => playSound("click")}
                  className="bg-[#be007a] hover:bg-[#d8008b] text-white font-medium px-3.5 py-1.5 rounded-xl text-xs transition flex items-center gap-1.5 shadow shadow-[#be007a]/25"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Ver em 3D</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-4 border-[#be007a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-purple-300 text-sm">Carregando catálogo paleontológico...</p>
        </div>
      }
    >
      <CatalogoContent />
    </Suspense>
  );
}
