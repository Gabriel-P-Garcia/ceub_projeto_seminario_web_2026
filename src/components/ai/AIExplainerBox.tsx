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
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Gerador Adaptativo Paleontológico (IA)
            </h3>
            <p className="text-xs text-slate-400">
              Explicações científicas personalizadas para a faixa etária ativa
            </p>
          </div>
        </div>

        {/* Badge do Nível Atual */}
        <div className="self-start sm:self-auto bg-amber-950/60 border border-amber-700/50 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
          Modo Ativo:{" "}
          {ageLevel === "infantil"
            ? "Infantil 🧒"
            : ageLevel === "escolar"
            ? "Escolar 🎒"
            : "Acadêmico 🔬"}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAsk} className="flex gap-2 mb-4">
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
          className="flex-1 bg-slate-950/80 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-amber-900/30 shrink-0"
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
        <div className="bg-slate-950/80 border border-amber-900/50 rounded-xl p-4 animate-in fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              {result.readingLevelLabel}
            </span>
            <button
              onClick={() => {
                speakText(result.explanation);
                playSound("click");
              }}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
              title="Ouvir resposta (Acessibilidade)"
            >
              <Volume2 className="w-3.5 h-3.5" /> Ouvir Áudio
            </button>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {result.explanation}
          </p>

          {/* Minidicionário / Vocabulário Paleontológico */}
          {result.vocabulary && result.vocabulary.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Vocabulário Científico:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {result.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 text-xs"
                  >
                    <span className="text-amber-300 font-bold block">{v.term}:</span>
                    <span className="text-slate-400 text-[11px] leading-tight block">
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
