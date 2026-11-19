import React from "react";
import Link from "next/link";
import { Shield, Cpu, Activity, Database, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0d0118] border-t border-[#3c0554]/60 text-purple-200/80 py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
        {/* Coluna 1: Sobre & Logo CEUB */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦕</span>
            <span className="text-lg font-bold text-white tracking-tight">
              Dino<span className="text-[#be007a]">Pédia</span>
            </span>
          </div>

          <div className="inline-block bg-white p-2 rounded-lg shadow-md border border-[#3c0554]/40 my-1">
            <img
              src="/ceub-logo.png"
              alt="Logomarca Oficial CEUB"
              className="h-6 w-auto object-contain"
            />
          </div>

          <p className="text-purple-300/80 leading-relaxed text-[11px]">
            Plataforma web educativa e interativa de paleobiologia, evolução e anatomia comparada de dinossauros. Desenvolvida com a identidade visual oficial do CEUB.
          </p>
          <div className="text-[11px] text-[#f43f9e] font-mono font-semibold">
            Centro Universitário de Brasília • 2026
          </div>
        </div>

        {/* Coluna 2: Equipe e Autoria */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#be007a]" /> Autoria do Projeto
          </h4>
          <ul className="space-y-1.5">
            <li className="text-slate-100 font-medium">Gabriel Caramez</li>
            <li className="text-slate-100 font-medium">Gabriel Pereira Garcia</li>
            <li className="text-purple-400 text-[11px]">Centro Universitário de Brasília (CEUB)</li>
            <li className="text-purple-400 text-[11px]">Seminário Web & Arquitetura de Software</li>
          </ul>
        </div>

        {/* Coluna 3: Arquitetura & Stack */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#f43f9e]" /> Stack Tecnológico
          </h4>
          <ul className="space-y-1 text-purple-200">
            <li>• Next.js com TypeScript & Turbopack</li>
            <li>• Three.js / React Three Fiber (R3F)</li>
            <li>• SQLite com Prisma ORM 6.4</li>
            <li>• Zustand & Tailwind CSS (Paleta CEUB)</li>
            <li>• REST API & GraphQL Schema Engine</li>
            <li>• Paleobiology Database (PBDB) Sync</li>
          </ul>
        </div>

        {/* Coluna 4: SLAs e Conformidade */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#be007a]" /> Requisitos Não Funcionais
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-[#19032d] p-2 rounded-lg border border-[#3c0554]">
              <span className="text-purple-200">Disponibilidade (SLA):</span>
              <span className="text-[#f43f9e] font-mono font-bold">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-between bg-[#19032d] p-2 rounded-lg border border-[#3c0554]">
              <span className="text-purple-200">Latência Média da API:</span>
              <span className="text-emerald-400 font-mono font-bold">&lt; 300ms</span>
            </div>
            <div className="flex items-center justify-between bg-[#19032d] p-2 rounded-lg border border-[#3c0554]">
              <span className="text-purple-200">Acessibilidade:</span>
              <span className="text-purple-300 font-mono font-bold">WCAG 2.1 AA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linha Inferior com Links de Monitoramento */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#3c0554]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div className="flex items-center gap-4 text-purple-300">
          <Link href="/api/healthz" target="_blank" className="hover:text-[#f43f9e] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Health Check (/healthz)
          </Link>
          <Link href="/api/readyz" target="_blank" className="hover:text-[#f43f9e] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#f43f9e]" /> Readiness (/readyz)
          </Link>
          <Link href="/api/graphql" target="_blank" className="hover:text-[#f43f9e] flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-purple-300" /> GraphQL Endpoint
          </Link>
          <Link href="/api/pbdb" target="_blank" className="hover:text-[#f43f9e] flex items-center gap-1">
            🌐 PBDB Sync API
          </Link>
        </div>
        <p className="text-purple-400">
          © 2026 DinoPédia • CEUB. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
