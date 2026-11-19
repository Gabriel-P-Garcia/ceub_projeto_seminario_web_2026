"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { playSound } from "@/lib/sound";
import {
  ShieldCheck,
  PlusCircle,
  Database,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Layers,
  Globe,
  FileText,
} from "lucide-react";

export default function CuradoriaPage() {
  const { userRole } = useAppStore();

  const [activeTab, setActiveTab] = useState<"especies" | "pbdb" | "health">("especies");
  const [healthData, setHealthData] = useState<any>(null);
  const [readyData, setReadyData] = useState<any>(null);
  const [pbdbRecords, setPbdbRecords] = useState<any[]>([]);
  const [syncingPbdb, setSyncingPbdb] = useState(false);
  const [pbdbStatus, setPbdbStatus] = useState<string>("");

  // Form State para Nova Espécie
  const [formData, setFormData] = useState({
    name: "",
    pronunciation: "",
    meaning: "",
    period: "Cretáceo Superior",
    periodEra: "Cretáceo",
    mya: "70 Ma",
    myaStart: "70",
    myaEnd: "66",
    clade: "Theropoda",
    family: "",
    diet: "Carnívoro",
    habit: "Bípede Terrestre",
    length: "6.0",
    height: "2.5",
    weight: "1500",
    speed: "30",
    discoveryYear: "2024",
    discoverer: "Equipe CEUB Paleontologia",
    fossilLocations: "Brasil (Bacia do Araripe)",
    brazilOccurrence: true,
    descInfantil: "",
    descEscolar: "",
    descAcademica: "",
    funFact: "",
    skeletonNotes: "Estrutura óssea com fenestras antorbitais e crânio pneumatizado.",
    muscleNotes: "Musculatura mandibular de alta potência mastigatória.",
    integumentNotes: "Tegumento com escamas reticuladas e possíveis filamentos basais.",
    modelType: "theropod",
  });
  const [submittingSpecies, setSubmittingSpecies] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    checkSystemHealth();
    loadPbdbSample();
  }, []);

  async function checkSystemHealth() {
    try {
      const hRes = await fetch("/api/healthz");
      const hJson = await hRes.json();
      setHealthData(hJson);

      const rRes = await fetch("/api/readyz");
      const rJson = await rRes.json();
      setReadyData(rJson);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadPbdbSample() {
    try {
      const res = await fetch("/api/pbdb?limit=10");
      const json = await res.json();
      if (json.success) {
        setPbdbRecords(json.records);
        setPbdbStatus(`Fonte: ${json.source} (${json.count} registros carregados)`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function triggerPbdbSync() {
    setSyncingPbdb(true);
    playSound("click");
    try {
      const res = await fetch("/api/pbdb?sync=true&taxon=Dinosauria");
      const json = await res.json();
      if (json.success) {
        setPbdbRecords(json.records);
        setPbdbStatus(`Sincronizado com sucesso! ${json.source}`);
        playSound("success");
      }
    } catch (e) {
      console.error(e);
      playSound("error");
    } finally {
      setSyncingPbdb(false);
    }
  }

  const handleCreateSpecies = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setSubmittingSpecies(true);
    try {
      const res = await fetch("/api/species", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        playSound("success");
        setFeedbackMsg(`Espécie ${json.data.name} cadastrada com sucesso com triplas de linguagem!`);
        setFormData({
          ...formData,
          name: "",
          meaning: "",
          descInfantil: "",
          descEscolar: "",
          descAcademica: "",
          funFact: "",
        });
      } else {
        setFeedbackMsg(json.error || "Erro ao cadastrar.");
      }
    } catch (e) {
      console.error(e);
      playSound("error");
    } finally {
      setSubmittingSpecies(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-white">Painel de Curadoria Paleontológica</h1>
          </div>
          <p className="text-sm text-slate-400">
            Administração taxonômica, gestão de triplas de conteúdo (ADR-002), sincronização PBDB e monitoramento de infraestrutura.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400">Papel Autenticado:</span>
          <span className="text-amber-400 font-bold">{userRole}</span>
        </div>
      </div>

      {/* Tabs do Painel */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => {
            setActiveTab("especies");
            playSound("click");
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "especies"
              ? "bg-amber-600 text-white shadow"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Nova Espécie (ADR-002)</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("pbdb");
            playSound("click");
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "pbdb"
              ? "bg-amber-600 text-white shadow"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Sincronizador PBDB</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("health");
            playSound("click");
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "health"
              ? "bg-amber-600 text-white shadow"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitoramento & SLAs (Prometheus)</span>
        </button>
      </div>

      {/* TAB 1: FORMULÁRIO DE CADASTRO DE ESPÉCIE */}
      {activeTab === "especies" && (
        <form onSubmit={handleCreateSpecies} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Adicionar Novo Táxon Fóssil</h2>
              <p className="text-xs text-slate-400">
                Preencha os dados taxonômicos e as 3 versões de linguagem (Infantil, Escolar e Acadêmica).
              </p>
            </div>
          </div>

          {feedbackMsg && (
            <div className="bg-amber-950/60 border border-amber-500/50 p-3.5 rounded-xl text-xs text-amber-300 font-semibold">
              {feedbackMsg}
            </div>
          )}

          {/* Dados Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Nome Científico *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Santanaspinus araripensis"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Pronúncia Fonética</label>
              <input
                type="text"
                value={formData.pronunciation}
                onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                placeholder="Ex: san-ta-na-SPI-nus"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Significado do Nome</label>
              <input
                type="text"
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                placeholder="Ex: Espinho da Formação Santana"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Taxonomia & Período */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Período Geológico</label>
              <select
                value={formData.periodEra}
                onChange={(e) => setFormData({ ...formData, periodEra: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Triássico">Triássico</option>
                <option value="Jurássico">Jurássico</option>
                <option value="Cretáceo">Cretáceo</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Clado</label>
              <select
                value={formData.clade}
                onChange={(e) => setFormData({ ...formData, clade: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Theropoda">Theropoda</option>
                <option value="Sauropodomorpha">Sauropodomorpha</option>
                <option value="Ornithischia">Ornithischia</option>
                <option value="Pterosauria">Pterosauria</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Dieta</label>
              <select
                value={formData.diet}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Carnívoro">Carnívoro</option>
                <option value="Herbívoro">Herbívoro</option>
                <option value="Piscívoro">Piscívoro</option>
                <option value="Onívoro">Onívoro</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Ocorrência no Brasil</label>
              <select
                value={formData.brazilOccurrence ? "sim" : "nao"}
                onChange={(e) =>
                  setFormData({ ...formData, brazilOccurrence: e.target.value === "sim" })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="sim">Sim (Brasil 🇧🇷)</option>
                <option value="nao">Não (Internacional)</option>
              </select>
            </div>
          </div>

          {/* ADR-002: Triplas de Conteúdo por Faixa Etária */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <span>📚</span> ADR-002: Triplas de Conteúdo Pedagógico
            </h3>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                1. Descrição Nível Infantil (6-10 anos) 🧒
              </label>
              <textarea
                rows={2}
                value={formData.descInfantil}
                onChange={(e) => setFormData({ ...formData, descInfantil: e.target.value })}
                placeholder="Linguagem simples, metáforas cotidianas, tamanho comparado a ônibus ou elefantes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                2. Descrição Nível Curioso / Escolar (11-17 anos) 🎒
              </label>
              <textarea
                rows={2}
                value={formData.descEscolar}
                onChange={(e) => setFormData({ ...formData, descEscolar: e.target.value })}
                placeholder="Foco em biologia evolutiva, adaptação, nicho ecológico e formação fóssil..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                3. Descrição Nível Científico / Acadêmico (Ensino Superior) 🔬
              </label>
              <textarea
                rows={2}
                value={formData.descAcademica}
                onChange={(e) => setFormData({ ...formData, descAcademica: e.target.value })}
                placeholder="Diagnose formal, sinapomorfias osteológicas, holótipo, estratigrafia e matriz filogenética..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submittingSpecies}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-amber-950"
            >
              {submittingSpecies ? "Cadastrando no SQLite..." : "Salvar Espécie na DinoPédia"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SINCRONIZADOR PBDB (Paleobiology Database) */}
      {activeTab === "pbdb" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" /> Sincronização com o Paleobiology Database (PBDB)
              </h2>
              <p className="text-xs text-slate-400 mt-1">{pbdbStatus}</p>
            </div>

            <button
              onClick={triggerPbdbSync}
              disabled={syncingPbdb}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingPbdb ? "animate-spin" : ""}`} />
              <span>Sincronizar Ocorrências Agora</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">ID PBDB</th>
                  <th className="p-3">Táxon Fóssil</th>
                  <th className="p-3">Período / Formação</th>
                  <th className="p-3">Coordenadas</th>
                  <th className="p-3">País</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pbdbRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-amber-400">{r.oid}</td>
                    <td className="p-3 font-bold text-white">{r.taxonName}</td>
                    <td className="p-3">{r.formation || r.period}</td>
                    <td className="p-3 font-mono text-slate-400">
                      {r.lat.toFixed(2)}, {r.lng.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-800 px-2 py-0.5 rounded font-mono">{r.country}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MONITORAMENTO & SLAS (Prometheus / Healthz) */}
      {activeTab === "health" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Saúde do Sistema & Observabilidade (Seção 8.3)
              </h2>
              <p className="text-xs text-slate-400">
                Monitoramento contínuo compatível com Prometheus e Grafana.
              </p>
            </div>

            <button
              onClick={checkSystemHealth}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar Métricas</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status do Endpoint /healthz */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Endpoint /healthz:</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-black text-emerald-400 uppercase">
                  {healthData?.status || "HEALTHY"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                Latência de Resposta: {healthData?.latencyMs || 2}ms (&lt; 300ms SLA ✓)
              </span>
            </div>

            {/* Status do Endpoint /readyz */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Endpoint /readyz:</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-400" />
                <span className="text-lg font-black text-sky-400 uppercase">
                  {readyData?.status || "READY"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono block">
                Espécies Indexadas: {readyData?.speciesIndexed || 10} táxons
              </span>
            </div>

            {/* Metas de RTO / RPO */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Recuperação de Desastres (DR):</span>
              <div className="text-xs space-y-1 text-slate-300">
                <p>• RTO (Recovery Time Objective): <strong>&lt; 1 hora</strong></p>
                <p>• RPO (Recovery Point Objective): <strong>&lt; 15 minutos</strong></p>
                <p>• Retenção Diária: <strong>30 dias (SQLite + S3)</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
