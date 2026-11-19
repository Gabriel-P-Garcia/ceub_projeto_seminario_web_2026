"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useAppStore, AgeLevel } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  Trophy,
  Flame,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Award,
} from "lucide-react";

interface Question {
  id: string;
  category: string;
  level: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  speciesHint?: string;
}

export default function QuizPage() {
  const {
    ageLevel,
    setAgeLevel,
    score,
    addPoints,
    streak,
    incrementStreak,
    resetStreak,
    unlockedBadges,
    unlockBadge,
  } = useAppStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/quiz?level=${ageLevel}`);
        const json = await res.json();
        if (json.success && json.data) {
          setQuestions(json.data);
          setCurrentIndex(0);
          setSelectedOption(null);
          setIsAnswered(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [ageLevel]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;

    if (isCorrect) {
      playSound("success");
      addPoints(50);
      incrementStreak();

      // Confetes festivos
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      // Desbloquear distintivos de gamificação
      unlockBadge("primeiro_fossil");
      if (streak + 1 >= 3) {
        unlockBadge("mestre_mesozoico");
      }
      if (currentQuestion.speciesHint?.includes("Oxalaia") || currentQuestion.speciesHint?.includes("Buriolestes")) {
        unlockBadge("guardiao_brasil");
      }
    } else {
      playSound("error");
      resetStreak();
    }
  };

  const handleNext = () => {
    playSound("click");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Fim do quiz
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      playSound("badge");
    }
  };

  const badgesList = [
    { id: "primeiro_fossil", name: "Primeiro Fóssil", icon: "🦴", desc: "Respondeu à sua primeira pergunta no quiz" },
    { id: "mestre_mesozoico", name: "Mestre do Mesozoico", icon: "⚡", desc: "Alcançou 3 acertos seguidos sem errar" },
    { id: "guardiao_brasil", name: "Guardião Brasileiro", icon: "🇧🇷", desc: "Acertou um desafio sobre a paleontologia do Brasil" },
    { id: "curador_supremo", name: "Curador Honorário", icon: "🎓", desc: "Atingiu mais de 300 pontos de conhecimento" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Cabeçalho de Gamificação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-white">Quizzes & Gamificação</h1>
          </div>
          <p className="text-sm text-slate-400">
            Perguntas adaptadas ao nível ativo ({ageLevel.toUpperCase()}) para fixação de conteúdos biológicos e taxonômicos.
          </p>
        </div>

        {/* Marcadores de Pontuação e Streak */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-slate-900 border border-amber-900/50 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block -mb-1">Pontos</span>
              <span className="text-amber-400 font-black font-mono">{score} pts</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-orange-900/50 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 block -mb-1">Sequência</span>
              <span className="text-orange-400 font-black font-mono">{streak}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chave Seletora de Faixa Etária para o Quiz */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-300 font-semibold">
          Dificuldade calibrada para o nível:
        </span>
        <div className="flex items-center gap-1.5">
          {(["infantil", "escolar", "academico"] as AgeLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setAgeLevel(lvl);
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                ageLevel === lvl
                  ? "bg-amber-600 text-white shadow"
                  : "bg-slate-950 text-slate-400 hover:text-white"
              }`}
            >
              {lvl === "infantil" ? "🧒 Infantil" : lvl === "escolar" ? "🎒 Escolar" : "🔬 Acadêmico"}
            </button>
          ))}
        </div>
      </div>

      {/* Área da Pergunta Ativa */}
      {loading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center animate-pulse">
          <p className="text-slate-400 text-sm">Carregando perguntas pedagógicas...</p>
        </div>
      ) : !currentQuestion ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Parabéns! Você concluiu as perguntas deste nível.</h3>
          <p className="text-xs text-slate-400">
            Experimente mudar para o nível Escolar ou Acadêmico para desafios mais aprofundados.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-amber-950/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Topo do Card de Pergunta */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-mono">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-semibold capitalize">
              {currentQuestion.category}
            </span>
          </div>

          {/* Enunciado da Pergunta */}
          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Opções de Resposta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;

              let btnStyle = "bg-slate-950 border-slate-800 hover:border-amber-500 text-slate-200";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-950/70 border-red-500 text-red-200 font-bold";
                } else {
                  btnStyle = "bg-slate-950/40 border-slate-800 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Justificativa e Explicação Científica após Responder */}
          {isAnswered && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Explicação Paleontológica:
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg"
                >
                  <span>Próxima Pergunta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Seção de Conquistas & Distintivos Desbloqueáveis */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Conquistas Desbloqueáveis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgesList.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition ${
                  isUnlocked
                    ? "bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20"
                    : "bg-slate-950/40 border-slate-800 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <h4 className={`text-xs font-bold mb-1 ${isUnlocked ? "text-amber-400" : "text-slate-400"}`}>
                  {b.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">{b.desc}</p>
                <span className="text-[10px] mt-2 inline-block font-mono font-semibold">
                  {isUnlocked ? "✓ Desbloqueado" : "🔒 Bloqueado"}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
