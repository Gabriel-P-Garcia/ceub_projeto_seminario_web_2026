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

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#be007a", "#f43f9e", "#3c0554", "#ffffff"],
      });

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
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3c0554] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-8 h-8 text-[#be007a]" />
            <h1 className="text-3xl font-black text-white">Quizzes & Gamificação</h1>
          </div>
          <p className="text-sm text-purple-300">
            Perguntas adaptadas ao nível ativo ({ageLevel.toUpperCase()}) para fixação de conteúdos biológicos e taxonômicos.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-[#17032a] border border-[#be007a]/40 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-[#f43f9e]" />
            <div>
              <span className="text-[10px] text-purple-300 block -mb-1">Pontos</span>
              <span className="text-white font-black font-mono">{score} pts</span>
            </div>
          </div>

          <div className="bg-[#17032a] border border-[#be007a]/40 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
            <Flame className="w-4 h-4 text-[#be007a] animate-pulse" />
            <div>
              <span className="text-[10px] text-purple-300 block -mb-1">Sequência</span>
              <span className="text-fuchsia-300 font-black font-mono">{streak}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dificuldade Calibrada */}
      <div className="bg-[#17032a]/80 border border-[#3c0554] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-purple-200 font-semibold">
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
                  ? "bg-[#be007a] text-white shadow"
                  : "bg-[#0c0116] text-purple-300 hover:text-white"
              }`}
            >
              {lvl === "infantil" ? "🧒 Infantil" : lvl === "escolar" ? "🎒 Escolar" : "🔬 Acadêmico"}
            </button>
          ))}
        </div>
      </div>

      {/* Área da Pergunta */}
      {loading ? (
        <div className="bg-[#17032a]/60 border border-[#3c0554] rounded-3xl p-12 text-center animate-pulse">
          <p className="text-purple-300 text-sm">Carregando perguntas pedagógicas...</p>
        </div>
      ) : !currentQuestion ? (
        <div className="bg-[#17032a]/60 border border-[#3c0554] rounded-3xl p-12 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Parabéns! Você concluiu as perguntas deste nível.</h3>
          <p className="text-xs text-purple-300">
            Experimente mudar para o nível Escolar ou Acadêmico para desafios mais aprofundados.
          </p>
        </div>
      ) : (
        <div className="bg-[#17032a]/90 border border-[#3c0554] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-purple-300 border-b border-[#3c0554] pb-3">
            <span className="font-mono">
              Questão {currentIndex + 1} de {questions.length}
            </span>
            <span className="bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 px-2.5 py-0.5 rounded-full font-semibold capitalize">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuestion.correctIndex;

              let btnStyle = "bg-[#0c0116] border-[#4a0a6a] hover:border-[#be007a] text-purple-100";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-950/70 border-red-500 text-red-200 font-bold";
                } else {
                  btnStyle = "bg-[#0c0116]/40 border-[#3c0554] text-purple-400 opacity-60";
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

          {isAnswered && (
            <div className="bg-[#0c0116] border border-[#3c0554] rounded-2xl p-5 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#be007a]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#f43f9e]">
                  Explicação Paleontológica:
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#be007a] to-[#7f0657] hover:from-[#d8008b] hover:to-[#be007a] text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#be007a]/30"
                >
                  <span>Próxima Pergunta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      <section className="bg-[#17032a] border border-[#3c0554] rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-[#be007a]" /> Conquistas Desbloqueáveis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgesList.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border transition ${
                  isUnlocked
                    ? "bg-[#0c0116] border-[#be007a]/60 shadow-lg shadow-[#be007a]/20"
                    : "bg-[#0c0116]/40 border-[#3c0554] opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <h4 className={`text-xs font-bold mb-1 ${isUnlocked ? "text-fuchsia-300" : "text-purple-400"}`}>
                  {b.name}
                </h4>
                <p className="text-[11px] text-purple-300 leading-snug">{b.desc}</p>
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
