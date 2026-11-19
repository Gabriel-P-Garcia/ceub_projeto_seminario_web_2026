"use client";

import React, { useState } from "react";
import { playSound } from "@/lib/sound";
import { useAppStore } from "@/lib/store";
import {
  Globe2,
  TreePine,
  Flame,
  AlertTriangle,
  RotateCcw,
  Thermometer,
} from "lucide-react";

export default function PaleoecologiaPage() {
  const { ageLevel } = useAppStore();

  const [selectedEra, setSelectedEra] = useState<"triassico" | "jurassico" | "cretaceo">("cretaceo");

  const [vegetation, setVegetation] = useState(80);
  const [oxygenLevel, setOxygenLevel] = useState(30);
  const [temperature, setTemperature] = useState(26);
  const [volcanism, setVolcanism] = useState(20);
  const [asteroidTriggered, setAsteroidTriggered] = useState(false);

  const herbivoreCapacity = Math.max(
    0,
    Math.round((vegetation * 1.2 * (oxygenLevel / 25) - volcanism * 0.4) * (asteroidTriggered ? 0.05 : 1))
  );

  const carnivoreCapacity = Math.max(
    0,
    Math.round((herbivoreCapacity * 0.35 - volcanism * 0.2) * (asteroidTriggered ? 0.0 : 1))
  );

  const biodiversityIndex = Math.min(
    100,
    Math.round((vegetation * 0.4 + oxygenLevel * 1.5 + (100 - volcanism) * 0.3) * (asteroidTriggered ? 0.15 : 1))
  );

  const triggerAsteroidImpact = () => {
    playSound("error");
    setAsteroidTriggered(true);
    setVegetation(10);
    setVolcanism(90);
    setTemperature(42);
  };

  const resetSimulation = () => {
    playSound("click");
    setAsteroidTriggered(false);
    setVegetation(80);
    setOxygenLevel(30);
    setTemperature(26);
    setVolcanism(20);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Cabeçalho */}
      <div className="border-b border-[#3c0554] pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe2 className="w-8 h-8 text-[#be007a]" />
          <h1 className="text-3xl font-black text-white">Módulo Paleoecológico</h1>
        </div>
        <p className="text-sm text-purple-300">
          Mapas interativos da Deriva Continental e simulação ecossistêmica das cadeias alimentares da Era Mesozoica.
        </p>
      </div>

      {/* SEÇÃO 1: DERIVA CONTINENTAL */}
      <section className="bg-[#17032a]/90 border border-[#3c0554] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-[#be007a]">🌍</span> Deriva Continental & Paleobiogeografia
            </h2>
            <p className="text-xs text-purple-300">
              Observe a separação das placas tectônicas e como os fósseis se distribuíram entre continentes.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0c0116] p-1.5 rounded-2xl border border-[#4a0a6a] self-start">
            <button
              onClick={() => {
                setSelectedEra("triassico");
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedEra === "triassico"
                  ? "bg-[#be007a] text-white shadow"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              Triássico (252 Ma)
            </button>
            <button
              onClick={() => {
                setSelectedEra("jurassico");
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedEra === "jurassico"
                  ? "bg-[#be007a] text-white shadow"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              Jurássico (170 Ma)
            </button>
            <button
              onClick={() => {
                setSelectedEra("cretaceo");
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedEra === "cretaceo"
                  ? "bg-[#be007a] text-white shadow"
                  : "text-purple-300 hover:text-white"
              }`}
            >
              Cretáceo (90 Ma)
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b0333] via-[#0d0118] to-[#0d0118] border border-[#3c0554] p-6 min-h-[340px] flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 z-10">
            <div>
              <span className="text-xs text-[#f43f9e] font-bold uppercase tracking-wider">
                Configuração Tectônica:
              </span>
              <h3 className="text-2xl font-black text-white">
                {selectedEra === "triassico" && "Pangeia Unificada & Oceano Pantalassa"}
                {selectedEra === "jurassico" && "Laurásia (Norte) e Gondwana (Sul)"}
                {selectedEra === "cretaceo" && "Abertura do Atlântico Sul & Mares Interiores"}
              </h3>
            </div>

            <div className="bg-[#17032a]/95 border border-[#59107b] px-3 py-1.5 rounded-xl text-xs font-mono text-fuchsia-300">
              {selectedEra === "triassico" && "Tempo: ~235 Milhões de anos atrás"}
              {selectedEra === "jurassico" && "Tempo: ~165 Milhões de anos atrás"}
              {selectedEra === "cretaceo" && "Tempo: ~95 Milhões de anos atrás"}
            </div>
          </div>

          <div className="py-6 flex items-center justify-center relative">
            <svg viewBox="0 0 800 320" className="w-full max-w-3xl h-auto drop-shadow-2xl">
              <rect width="800" height="320" rx="16" fill="#120224" fillOpacity="0.8" />

              {selectedEra === "triassico" && (
                <g>
                  <path
                    d="M 280 80 Q 420 70 540 100 Q 560 160 520 220 Q 450 260 320 250 Q 250 200 240 150 Q 260 100 280 80 Z"
                    fill="#3c0554"
                    stroke="#be007a"
                    strokeWidth="2.5"
                  />
                  <path d="M 400 130 Q 480 150 430 180 Z" fill="#120224" />
                  <text x="360" y="160" fill="#ffffff" fontSize="13" fontWeight="bold">
                    PANGEIA
                  </text>
                  <text x="550" y="160" fill="#f43f9e" fontSize="11" fontStyle="italic">
                    Mar de Tethys
                  </text>
                  <text x="140" y="160" fill="#c084fc" fontSize="11" fontStyle="italic">
                    Oceano Pantalassa
                  </text>

                  <circle cx="340" cy="210" r="7" fill="#be007a" stroke="#ffffff" strokeWidth="2" />
                  <text x="355" y="215" fill="#f43f9e" fontSize="11" fontWeight="bold">
                    📍 Santa Maria (Buriolestes)
                  </text>
                </g>
              )}

              {selectedEra === "jurassico" && (
                <g>
                  <path
                    d="M 220 70 Q 360 60 500 80 Q 520 130 460 140 Q 340 130 230 120 Z"
                    fill="#4a0e4e"
                    stroke="#be007a"
                    strokeWidth="2"
                  />
                  <text x="330" y="105" fill="#ffffff" fontSize="13" fontWeight="bold">
                    LAURÁSIA
                  </text>

                  <text x="320" y="155" fill="#f43f9e" fontSize="10" fontStyle="italic">
                    Rifte Oceânico Central
                  </text>

                  <path
                    d="M 270 170 Q 440 160 520 190 Q 500 270 380 270 Q 280 250 250 200 Z"
                    fill="#3b0754"
                    stroke="#c026d3"
                    strokeWidth="2"
                  />
                  <text x="360" y="220" fill="#ffffff" fontSize="13" fontWeight="bold">
                    GONDWANA
                  </text>

                  <circle cx="280" cy="95" r="7" fill="#be007a" stroke="#ffffff" strokeWidth="2" />
                  <text x="210" y="85" fill="#f43f9e" fontSize="10">
                    📍 Formação Morrison (Brachiosaurus)
                  </text>
                </g>
              )}

              {selectedEra === "cretaceo" && (
                <g>
                  <path
                    d="M 180 80 Q 260 70 300 110 Q 280 150 210 140 Z"
                    fill="#3b0764"
                    stroke="#be007a"
                    strokeWidth="2"
                  />
                  <text x="210" y="110" fill="#ffffff" fontSize="11" fontWeight="bold">
                    América do Norte
                  </text>

                  <path
                    d="M 400 80 Q 550 70 600 120 Q 520 150 420 130 Z"
                    fill="#3b0764"
                    stroke="#be007a"
                    strokeWidth="2"
                  />
                  <text x="470" y="110" fill="#ffffff" fontSize="11" fontWeight="bold">
                    Eurásia
                  </text>

                  <path
                    d="M 280 170 Q 340 180 330 250 Q 270 260 260 200 Z"
                    fill="#4a0e4e"
                    stroke="#d946ef"
                    strokeWidth="2"
                  />
                  <text x="275" y="220" fill="#ffffff" fontSize="11" fontWeight="bold">
                    América do Sul
                  </text>

                  <path
                    d="M 400 170 Q 480 180 470 260 Q 390 260 380 200 Z"
                    fill="#3c0554"
                    stroke="#be007a"
                    strokeWidth="2"
                  />
                  <text x="420" y="220" fill="#ffffff" fontSize="11" fontWeight="bold">
                    África
                  </text>

                  <circle cx="315" cy="195" r="7" fill="#be007a" stroke="#ffffff" strokeWidth="2" />
                  <text x="140" y="195" fill="#f43f9e" fontSize="10" fontWeight="bold">
                    📍 Araripe & Cajual (Oxalaia / Irritator)
                  </text>

                  <circle cx="230" cy="95" r="7" fill="#f43f9e" stroke="#ffffff" strokeWidth="2" />
                  <text x="110" y="90" fill="#f5d0fe" fontSize="10">
                    📍 Hell Creek (T-Rex)
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="bg-[#17032a]/95 border border-[#3c0554] p-4 rounded-xl text-xs text-purple-200 leading-relaxed">
            {selectedEra === "triassico" && (
              <p>
                <strong>No Triássico:</strong> Todos os continentes estavam unidos no supercontinente <em>Pangeia</em>, cercado pelo oceano Pantalassa. O interior era árido e seco. No sul do que hoje é o Brasil (Rio Grande do Sul), os primeiros dinossauros pequenos e ágeis surgiram e começaram a povoar o planeta.
              </p>
            )}
            {selectedEra === "jurassico" && (
              <p>
                <strong>No Jurássico:</strong> A Pangeia se partiu em duas gigantescas massas: <em>Laurásia</em> (ao norte) e <em>Gondwana</em> (ao sul). O clima ficou mais úmido e quente, permitindo a proliferação de densas florestas de coníferas e samambaias que alimentavam os enormes saurópodes de pescoço longo.
              </p>
            )}
            {selectedEra === "cretaceo" && (
              <p>
                <strong>No Cretáceo:</strong> A América do Sul e a África se distanciaram, abrindo o Oceano Atlântico Sul. Em bacias costeiras e lagunas hipersalinas no Nordeste do Brasil (como a Bacia do Araripe e a Ilha do Cajual), dinossauros como o <em>Oxalaia</em> e o <em>Irritator</em> caçavam peixes ancestrais.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SIMULADOR DE ECOSSISTEMA */}
      <section className="bg-[#17032a]/90 border border-[#3c0554] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-400" />
              Simulador Trófico Mesozoico
            </h2>
            <p className="text-xs text-purple-300">
              Ajuste as variáveis ambientais e observe o equilíbrio dinâmico entre produtores, herbívoros e predadores de topo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAsteroidImpact}
              disabled={asteroidTriggered}
              className="bg-[#be007a] hover:bg-[#d8008b] disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-[#be007a]/30"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>💥 Asteroide K-Pg (66 Ma)</span>
            </button>

            <button
              onClick={resetSimulation}
              className="bg-[#280540] hover:bg-[#3c0760] text-purple-200 text-xs px-3 py-2 rounded-xl transition flex items-center gap-1"
              title="Resetar Simulação"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar</span>
            </button>
          </div>
        </div>

        {asteroidTriggered && (
          <div className="bg-red-950/70 border border-red-700/80 p-4 rounded-2xl flex items-start gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-red-200">
                EVENTO DE EXTINÇÃO EM MASSA DO LIMITE CRETÁCEO-PALEÓGENO (K-Pg)
              </h4>
              <p className="text-red-300/90 mt-1">
                O impacto de um asteroide de 10 km na Península de Yucatán bloqueou a luz solar por meses. A quebra da fotossíntese dizimou os grandes herbívoros e predadores de topo. Apenas pequenos maniraptoranos emplumados (ancestrais das aves modernas) e pequenos mamíferos sobrevivem sob o solo!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#0c0116] border border-[#3c0554] p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-[#be007a]" /> Parâmetros Paleoclimáticos
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-purple-300">Biomassa Vegetal (Produtores):</span>
                <span className="text-emerald-400 font-bold">{vegetation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vegetation}
                onChange={(e) => setVegetation(Number(e.target.value))}
                className="w-full accent-[#be007a] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-purple-300">Concentração de Oxigênio (O₂):</span>
                <span className="text-[#f43f9e] font-bold">{oxygenLevel}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="35"
                value={oxygenLevel}
                onChange={(e) => setOxygenLevel(Number(e.target.value))}
                className="w-full accent-[#f43f9e] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-purple-300">Temperatura Média Global:</span>
                <span className="text-fuchsia-300 font-bold">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-fuchsia-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-purple-300">Atividade Vulcânica (Trapps de Deccan):</span>
                <span className="text-red-400 font-bold">{volcanism}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volcanism}
                onChange={(e) => setVolcanism(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0c0116] border border-[#3c0554] p-5 rounded-2xl flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Pirâmide Trófica & Populações Sustentadas</span>
              <span className="text-xs bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 px-2 py-0.5 rounded-full font-mono">
                Biodiversidade: {biodiversityIndex}/100
              </span>
            </h3>

            <div className="space-y-3">
              <div className="bg-[#24033c] border border-[#59107b] p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦖</span>
                  <div>
                    <span className="font-bold text-fuchsia-200 block">Predadores de Topo</span>
                    <span className="text-purple-300 text-[11px]">T-Rex, Oxalaia, Spinosaurus</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f43f9e] font-mono">
                    {carnivoreCapacity}
                  </span>
                  <span className="text-[10px] text-purple-400 block">população relativa</span>
                </div>
              </div>

              <div className="bg-[#1f0333] border border-[#4a0a6a] p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦕</span>
                  <div>
                    <span className="font-bold text-purple-200 block">Herbívoros Primários</span>
                    <span className="text-purple-300 text-[11px]">Brachiosaurus, Triceratops, Ankylosaurus</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-fuchsia-300 font-mono">
                    {herbivoreCapacity}
                  </span>
                  <span className="text-[10px] text-purple-400 block">população relativa</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <div>
                    <span className="font-bold text-emerald-300 block">Produtores Primários</span>
                    <span className="text-purple-300 text-[11px]">Coníferas, Samambaias, Cicadáceas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {vegetation}%
                  </span>
                  <span className="text-[10px] text-purple-400 block">cobertura vegetal</span>
                </div>
              </div>
            </div>

            <div className="bg-[#17032a] p-3 rounded-xl border border-[#3c0554] text-xs text-purple-200">
              <span className="font-bold text-[#f43f9e] block mb-1">Diagnóstico do Ecossistema:</span>
              {asteroidTriggered ? (
                <p>
                  Colapso catastrófico! Sem luz solar, os produtores morreram, causando extinção dos grandes saurópodes e tiranossaurídeos por inanição.
                </p>
              ) : carnivoreCapacity > 20 ? (
                <p>
                  Ecossistema fértil e exuberante. Alta biomassa vegetal e oxigenação suportam gigantismo em saurópodes e grandes terópodes dominantes.
                </p>
              ) : (
                <p>
                  Ecossistema em estresse ambiental. Escassez de biomassa reduz drasticamente a população de carnívoros de grande porte.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
