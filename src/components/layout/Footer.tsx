import React from "react";
import Link from "next/link";
import { Shield, Cpu, Activity, Database, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-amber-950/40 text-slate-400 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
        {/* Coluna 1: Sobre */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦕</span>
            <span className="text-lg font-bold text-white tracking-tight">
              Dino<span className="text-amber-500">Pédia</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Plataforma web educativa e interativa de paleobiologia, evolução e anatomia comparada de dinossauros. Desenvolvida para todas as faixas etárias com visualização 3D WebGL e rigor científico.
          </p>
          <div className="text-[11px] text-amber-500/90 font-mono">
            Projeto Seminário Web CEUB 2026
          </div>
        </div>

        {/* Coluna 2: Equipe e Autoria */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-500" /> Responsáveis Técnicos
          </h4>
          <ul className="space-y-1.5">
            <li className="text-slate-300 font-medium">Gabriel Caramez</li>
            <li className="text-slate-300 font-medium">Gabriel Pereira Garcia</li>
            <li className="text-slate-500 text-[11px]">Centro Universitário de Brasília (CEUB)</li>
            <li className="text-slate-500 text-[11px]">Seminário Web & Arquitetura de Software</li>
          </ul>
        </div>

        {/* Coluna 3: Arquitetura & Stack */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" /> Stack do Sistema
          </h4>
          <ul className="space-y-1 text-slate-300">
            <li>• Next.js com TypeScript & Turbopack</li>
            <li>• React Three Fiber (R3F) & Three.js</li>
            <li>• SQLite com Prisma ORM & Flyway</li>
            <li>• Zustand & Tailwind CSS</li>
            <li>• REST API & GraphQL Schema Engine</li>
            <li>• Sincronização PBDB (Paleobiology DB)</li>
          </ul>
        </div>

        {/* Coluna 4: SLAs e Conformidade */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" /> Requisitos Não Funcionais
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span>Disponibilidade (SLA):</span>
              <span className="text-emerald-400 font-mono font-bold">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span>Latência Média da API:</span>
              <span className="text-emerald-400 font-mono font-bold">&lt; 300ms</span>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span>Acessibilidade:</span>
              <span className="text-amber-400 font-mono font-bold">WCAG 2.1 AA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linha Inferior com Links de Monitoramento e APIs */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div className="flex items-center gap-4">
          <Link href="/api/healthz" target="_blank" className="hover:text-amber-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Health Check (/healthz)
          </Link>
          <Link href="/api/readyz" target="_blank" className="hover:text-amber-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-500" /> Readiness (/readyz)
          </Link>
          <Link href="/api/graphql" target="_blank" className="hover:text-amber-400 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-indigo-400" /> GraphQL Endpoint
          </Link>
          <Link href="/api/pbdb" target="_blank" className="hover:text-amber-400 flex items-center gap-1">
            🌐 PBDB Sync API
          </Link>
        </div>
        <p className="text-slate-500">
          © 2026 DinoPédia. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
