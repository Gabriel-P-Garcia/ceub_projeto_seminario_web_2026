"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Pin,
  Send,
  PlusCircle,
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  isVerified: boolean;
  createdAt: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  isVerified: boolean;
  isPinned: boolean;
  likes: number;
  createdAt: string;
  posts: Post[];
}

export default function ForumPage() {
  const { userRole } = useAppStore();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Dúvidas Escolares");
  const [authorNameInput, setAuthorNameInput] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const url = categoryFilter === "all" ? "/api/forum" : `/api/forum?category=${categoryFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setTopics(json.data);
        setSelectedTopic((current) => current ?? json.data[0] ?? null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTopics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchTopics]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          authorName: authorNameInput || `${userRole} Anônimo`,
          authorRole: userRole,
        }),
      });

      const json = await res.json();
      if (json.success) {
        playSound("success");
        setShowNewTopicModal(false);
        setNewTitle("");
        setNewContent("");
        fetchTopics();
      }
    } catch (e) {
      console.error(e);
      playSound("error");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTopic) return;

    setSubmittingReply(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_reply",
          topicId: selectedTopic.id,
          content: replyContent,
          authorName: authorNameInput || `${userRole} Participante`,
          authorRole: userRole,
        }),
      });

      const json = await res.json();
      if (json.success) {
        playSound("click");
        setReplyContent("");
        const updatedPosts = [...selectedTopic.posts, json.data];
        setSelectedTopic({ ...selectedTopic, posts: updatedPosts });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReply(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "Paleontólogo Curador") {
      return (
        <span className="inline-flex items-center gap-1 bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
          <CheckCircle2 className="w-3 h-3 text-[#be007a]" /> Curador Paleontológico
        </span>
      );
    }
    if (role === "Professor") {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
          Professor
        </span>
      );
    }
    if (role === "Administrador") {
      return (
        <span className="inline-flex items-center gap-1 bg-fuchsia-600/25 text-fuchsia-200 border border-fuchsia-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
          <ShieldCheck className="w-3 h-3 text-[#f43f9e]" /> Administrador
        </span>
      );
    }
    return (
      <span className="bg-[#280540] text-purple-200 text-[10px] px-2 py-0.5 rounded-full">
        Aluno
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3c0554] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-8 h-8 text-[#be007a]" />
            <h1 className="text-3xl font-black text-white">Fórum Moderado da Comunidade</h1>
          </div>
          <p className="text-sm text-purple-300">
            Espaço de debate científico com controle de acesso baseado em funções (RBAC: Aluno, Professor, Curador, Admin).
          </p>
        </div>

        <button
          onClick={() => {
            setShowNewTopicModal(true);
            playSound("click");
          }}
          className="bg-gradient-to-r from-[#be007a] to-[#7f0657] hover:from-[#d8008b] hover:to-[#be007a] text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#be007a]/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Tópico</span>
        </button>
      </div>

      {/* Filtro por Categoria */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["all", "Descobertas", "Dúvidas Escolares", "Debates Científicos", "Fósseis no Brasil"].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                playSound("click");
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                categoryFilter === cat
                  ? "bg-[#be007a] text-white shadow"
                  : "bg-[#17032a] text-purple-300 hover:text-white border border-[#3c0554]"
              }`}
            >
              {cat === "all" ? "Todos os Tópicos" : cat}
            </button>
          )
        )}
      </div>

      {/* Grade Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Discussões em Andamento ({topics.length})
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#17032a] rounded-xl animate-pulse border border-[#3c0554]" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="bg-[#17032a]/50 border border-[#3c0554] p-6 rounded-2xl text-center text-xs text-purple-300">
              Nenhum tópico encontrado nesta categoria.
            </div>
          ) : (
            topics.map((t) => {
              const isSelected = selectedTopic?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTopic(t);
                    playSound("click");
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition text-left space-y-2 ${
                    isSelected
                      ? "bg-[#1f0435] border-[#be007a] shadow-lg shadow-[#be007a]/25"
                      : "bg-[#17032a]/70 border-[#3c0554] hover:border-[#59107b]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] bg-[#280540] text-purple-200 px-2 py-0.5 rounded-full font-medium">
                      {t.category}
                    </span>
                    {t.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] text-[#f43f9e] font-bold">
                        <Pin className="w-3 h-3 text-[#be007a]" /> Fixado
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2">{t.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1 border-t border-[#3c0554]">
                    <span>{t.authorName}</span>
                    <span>{t.posts?.length || 0} respostas</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7 bg-[#17032a]/90 border border-[#3c0554] rounded-3xl p-6 sm:p-8 space-y-6">
          {selectedTopic ? (
            <>
              <div className="space-y-3 border-b border-[#3c0554] pb-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs bg-[#be007a]/20 text-[#f43f9e] border border-[#be007a]/40 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedTopic.category}
                  </span>
                  {selectedTopic.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-fuchsia-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#be007a]" /> Verificado por Paleontólogo
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedTopic.title}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-200">
                    {selectedTopic.authorName}
                  </span>
                  {getRoleBadge(selectedTopic.authorRole)}
                </div>

                <p className="text-sm text-purple-100 leading-relaxed pt-2">
                  {selectedTopic.content}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Respostas dos Participantes ({selectedTopic.posts?.length || 0})
                </h4>

                <div className="space-y-3">
                  {selectedTopic.posts?.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#0c0116] border border-[#3c0554] rounded-2xl p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.authorName}</span>
                          {getRoleBadge(p.authorRole)}
                        </div>
                      </div>
                      <p className="text-purple-100 leading-relaxed text-sm">{p.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-[#3c0554]">
                <div className="flex items-center justify-between text-xs text-purple-300">
                  <span>
                    Respondendo como: <strong className="text-[#f43f9e]">{userRole}</strong>
                  </span>
                </div>

                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escreva sua contribuição científica ou dúvida..."
                  rows={3}
                  className="w-full bg-[#0c0116] border border-[#4a0a6a] focus:border-[#be007a] rounded-xl p-3 text-xs text-purple-100 placeholder-purple-400/50 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyContent.trim()}
                    className="bg-[#be007a] hover:bg-[#d8008b] disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow shadow-[#be007a]/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Resposta</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-purple-300">
              Selecione um tópico ao lado para visualizar o debate.
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Tópico */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#17032a] border border-[#59107b] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Criar Nova Discussão Paleontológica</h3>

            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div>
                <label className="text-purple-300 font-semibold block mb-1">Título:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Novos fósseis de dentes encontrados no Maranhão..."
                  className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-xl p-2.5 text-purple-100 focus:outline-none focus:border-[#be007a]"
                />
              </div>

              <div>
                <label className="text-purple-300 font-semibold block mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-xl p-2.5 text-purple-100 focus:outline-none focus:border-[#be007a]"
                >
                  <option value="Descobertas">Descobertas</option>
                  <option value="Dúvidas Escolares">Dúvidas Escolares</option>
                  <option value="Debates Científicos">Debates Científicos</option>
                  <option value="Fósseis no Brasil">Fósseis no Brasil</option>
                </select>
              </div>

              <div>
                <label className="text-purple-300 font-semibold block mb-1">Seu Nome / Apelido:</label>
                <input
                  type="text"
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                  placeholder="Ex: Marina (Bióloga)"
                  className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-xl p-2.5 text-purple-100 focus:outline-none focus:border-[#be007a]"
                />
              </div>

              <div>
                <label className="text-purple-300 font-semibold block mb-1">Conteúdo:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva a hipótese, achado fóssil ou dúvida biológica..."
                  className="w-full bg-[#0c0116] border border-[#4a0a6a] rounded-xl p-2.5 text-purple-100 focus:outline-none focus:border-[#be007a]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 rounded-xl text-purple-300 hover:text-white bg-[#280540]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-[#be007a] hover:bg-[#d8008b] shadow shadow-[#be007a]/30"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
