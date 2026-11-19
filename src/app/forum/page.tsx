"use client";

import React, { useEffect, useState } from "react";
import { useAppStore, UserRole } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Pin,
  Send,
  PlusCircle,
  ThumbsUp,
  Filter,
  User,
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

  // Formulário de Novo Tópico
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Dúvidas Escolares");
  const [authorNameInput, setAuthorNameInput] = useState("");

  // Formulário de Resposta
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [categoryFilter]);

  async function fetchTopics() {
    setLoading(true);
    try {
      const url = categoryFilter === "all" ? "/api/forum" : `/api/forum?category=${categoryFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setTopics(json.data);
        if (json.data.length > 0 && !selectedTopic) {
          setSelectedTopic(json.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

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
        // Atualizar lista local
        const updatedPosts = [...selectedTopic.posts, json.data];
        setSelectedTopic({ ...selectedTopic, posts: updatedPosts });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReply(false);
    }
  };

  const getRoleBadge = (role: string, verified: boolean) => {
    if (role === "Paleontólogo Curador") {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
          <CheckCircle2 className="w-3 h-3 text-amber-400" /> Curador Paleontológico
        </span>
      );
    }
    if (role === "Professor") {
      return (
        <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
          👨‍🏫 Professor
        </span>
      );
    }
    if (role === "Administrador") {
      return (
        <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
          <ShieldCheck className="w-3 h-3 text-purple-400" /> Administrador
        </span>
      );
    }
    return (
      <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
        🎒 Aluno
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-white">Fórum Moderado da Comunidade</h1>
          </div>
          <p className="text-sm text-slate-400">
            Espaço de debate científico com controle de acesso baseado em funções (RBAC: Aluno, Professor, Curador, Admin).
          </p>
        </div>

        <button
          onClick={() => {
            setShowNewTopicModal(true);
            playSound("click");
          }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-900/30 self-start sm:self-auto"
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
                  ? "bg-amber-600 text-white shadow"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat === "all" ? "Todos os Tópicos" : cat}
            </button>
          )
        )}
      </div>

      {/* Grade Principal: Lista de Tópicos + Visualização da Discussão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Lista de Tópicos */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Discussões em Andamento ({topics.length})
          </h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-400">
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
                      ? "bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/30"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                      {t.category}
                    </span>
                    {t.isPinned && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                        <Pin className="w-3 h-3 text-amber-500" /> Fixado
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2">{t.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{t.authorName}</span>
                    <span>{t.posts?.length || 0} respostas</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Coluna Direita: Tópico Selecionado & Respostas */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          {selectedTopic ? (
            <>
              {/* Cabeçalho do Tópico Selecionado */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedTopic.category}
                  </span>
                  {selectedTopic.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Verificado por Paleontólogo
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {selectedTopic.title}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    {selectedTopic.authorName}
                  </span>
                  {getRoleBadge(selectedTopic.authorRole, selectedTopic.isVerified)}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed pt-2">
                  {selectedTopic.content}
                </p>
              </div>

              {/* Lista de Respostas */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Respostas dos Participantes ({selectedTopic.posts?.length || 0})
                </h4>

                <div className="space-y-3">
                  {selectedTopic.posts?.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{p.authorName}</span>
                          {getRoleBadge(p.authorRole, p.isVerified)}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">{p.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caixa de Envio de Resposta */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Respondendo como: <strong className="text-amber-400">{userRole}</strong>
                  </span>
                </div>

                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Escreva sua contribuição científica ou dúvida..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReply || !replyContent.trim()}
                    className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Resposta</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Selecione um tópico ao lado para visualizar o debate.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação de Novo Tópico */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-amber-900/60 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Criar Nova Discussão Paleontológica</h3>

            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Título:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Novos fósseis de dentes encontrados no Maranhão..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Categoria:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Descobertas">Descobertas</option>
                  <option value="Dúvidas Escolares">Dúvidas Escolares</option>
                  <option value="Debates Científicos">Debates Científicos</option>
                  <option value="Fósseis no Brasil">Fósseis no Brasil</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Seu Nome / Apelido:</label>
                <input
                  type="text"
                  value={authorNameInput}
                  onChange={(e) => setAuthorNameInput(e.target.value)}
                  placeholder="Ex: Marina (Bióloga)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Conteúdo:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva a hipótese, achado fóssil ou dúvida biológica..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-amber-600 hover:bg-amber-500 shadow"
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
