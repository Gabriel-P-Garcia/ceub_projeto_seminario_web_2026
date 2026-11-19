"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { playSound, speakText } from "@/lib/sound";
import { Sparkles, Send, Volume2, BookOpen, Loader2 } from "lucide-react";

interface AIExplainerBoxProps {
  initialSpeciesName?: string;
}

export default function AIExplainerBox({ initialSpeciesName }: AIExplainerBoxProps) {
  const { ageLevel } = useAppStore();
  const [query, setQuery] = useState(initialSpeciesName ? `Como o ${initialSpeciesName} vivia?` : "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    readingLevelLabel: string;
    explanation: string;
    vocabulary: { term: string; definition: string }[];
  } | null>(null);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    playSound("click");

    try {
      const res = await fetch("/api/ai-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          level: ageLevel,
          speciesName: initialSpeciesName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          readingLevelLabel: data.readingLevelLabel,
          explanation: data.explanation,
          vocabulary: data.vocabulary || [],
        });
        playSound("success");
      }
    } catch (err) {
      console.error(err);
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a042e] via-[#140224] to-[#28063f] border border-[#59107b]/70 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative CEUB Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#be007a]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#be007a]/20 border border-[#be007a]/40 text-[#f43f9e]">
            <Sparkles className="w-5 h-5 text-[#f43f9e]" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Gerador Adaptativo Paleontológico (IA)
            </h3>
            <p className="text-xs text-purple-300">
              Explicações científicas personalizadas para a faixa etária ativa
            </p>
          </div>
        </div>

        {/* Badge do Nível Atual */}
        <div className="self-start sm:self-auto bg-[#2b0544] border border-[#be007a]/50 px-3 py-1 rounded-full text-xs font-semibold text-fuchsia-200">
          Modo Ativo:{" "}
          {ageLevel === "infantil"
            ? "Infantil 🧒"
            : ageLevel === "escolar"
            ? "Escolar 🎒"
            : "Acadêmico 🔬"}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="flex gap-2 mb-4 relative z-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            ageLevel === "infantil"
              ? "Ex: Por que o T-Rex tinha dentes tão grandes?"
              : ageLevel === "escolar"
              ? "Ex: Como as penas evoluíram nos dinossauros terópodes?"
              : "Ex: Quais sinapomorfias definem o clado Spinosaurinae?"
          }
          className="flex-1 bg-[#0c0116]/90 border border-[#4a0a6a] focus:border-[#be007a] rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-400/60 focus:outline-none transition shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-gradient-to-r from-[#be007a] to-[#7f0657] hover:from-[#d8008b] hover:to-[#be007a] disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-[#be007a]/30 shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Explicar</span>
            </>
          )}
        </button>
      </form>

      {/* Resposta Gerada */}
      {result && (
        <div className="bg-[#0e021a]/95 border border-[#59107b] rounded-xl p-4 animate-in fade-in space-y-3 relative z-10">
          <div className="flex items-center justify-between border-b border-[#3c0554] pb-2">
            <span className="text-xs font-bold text-[#f43f9e] uppercase tracking-wide">
              {result.readingLevelLabel}
            </span>
            <button
              onClick={() => {
                speakText(result.explanation);
                playSound("click");
              }}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 transition"
              title="Ouvir resposta (Acessibilidade)"
            >
              <Volume2 className="w-3.5 h-3.5" /> Ouvir Áudio
            </button>
          </div>

          <p className="text-sm text-slate-100 leading-relaxed">
            {result.explanation}
          </p>

          {/* Minidicionário */}
          {result.vocabulary && result.vocabulary.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#f43f9e]" /> Vocabulário Científico:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="bg-[#19032d] border border-[#3c0554] rounded-lg p-2 text-xs"
                  >
                    <span className="text-fuchsia-300 font-bold block">{v.term}:</span>
                    <span className="text-purple-300/80 text-[11px] leading-tight block">
                      {v.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
