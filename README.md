# DinoPédia — Plataforma Educativa e Interativa de Paleontologia e Biologia

> **Projeto:** DinoPédia (Versão 1.0)  
> **Autores / Responsáveis Técnicos:** Gabriel Caramez / Gabriel Pereira Garcia  
> **Instituição:** Centro Universitário de Brasília (CEUB) — Seminário Web 2026  
> **Status:** Concluído e Validado em Produção  

---

## 1. Visão Geral do Sistema

O **DinoPédia** resolve a carência de plataformas integradas e acessíveis que ensinam paleontologia, evolução e biologia comparada com rigor científico e apelo didático. A plataforma atende desde crianças e estudantes escolares até graduandos e pesquisadores acadêmicos através de **conteúdo multinível adaptativo**, **modelos 3D anatômicos interativos**, simulações ecológicas e integração com bases globais de fósseis.

---

## 2. Principais Módulos e Funcionalidades

### 2.1 Catálogo Científico Dinâmico
- **Filtros Multivariados:** Por período geológico (*Triássico, Jurássico, Cretáceo*), dieta (*Carnívoro, Herbívoro, Piscívoro, Onívoro*), clado (*Theropoda, Sauropodomorpha, Ornithischia, Pterosauria*) e ordenação por métricas biométricas (comprimento, massa, data de descoberta).
- **Destaque Especial Brasil:** Filtro dedicado para espécies encontradas em território brasileiro (*Bacia do Araripe, Formação Santa Maria, Ilha do Cajual*).
- **Busca Textual Instantânea:** Pesquisa em tempo real por nome científico, descobertas, estratigrafia e localidades.

### 2.2 Explicação Adaptativa por Faixa Etária (ADR-002)
- **Chave Seletora Global de Linguagem:**
  - 🧒 **Infantil (6 a 10 anos):** Analogias cotidianas (ex: *"tamanho de 3 ônibus empilhados"*), foco lúdico e entusiasmo didático.
  - 🎒 **Curioso / Escolar (11 a 17 anos):** Ecologia, papel trófico, adaptações anatômicas e contexto temporal geológico.
  - 🔬 **Científico / Acadêmico (Ensino Superior):** Cladística, sinapomorfias osteológicas, holótipos, fenestras cranianas, matriz filogenética e estratigrafia formal.
- **Suporte Nativo a Triplas no Banco de Dados:** Campos `desc_infantil`, `desc_escolar` e `desc_academica` persistidos no SQLite via Prisma ORM.
- **Paleo-IA Integrada:** Gerador dinâmico de explicações para dúvidas livres com minidicionário paleontológico adaptado.

### 2.3 Laboratório Anatômico 3D (ADR-001)
- **Renderização WebGL de Alta Performance:** Construído com **Three.js** e **React Three Fiber (R3F)** integrado ao Next.js.
- **Camadas Anatômicas Alternáveis:**
  - 🦴 **Esqueleto:** Osteologia detalhada, crânio, fenestras, coluna vertebral, caixa torácica e membros locomotores.
  - 🥩 **Músculos:** Inserções miológicas, músculo adutor mandibular e *m. caudofemoralis longus*.
  - 🦎 **Pele & Penas:** Tegumento dérmico escamoso, osteodermas, velas dorsais e protopenas.
- **Hotspots Anatômicos Clicáveis:** Anotações com significância evolutiva diretamente sobre as estruturas 3D.
- **Comparação de Escala em Tempo Real:** Silhuetas 3D comparativas com Humano (1.8m), Carro (4.5m) e Elefante Africano (3.2m).
- **Acessibilidade por Voz:** Narração auditiva automatizada em português via Web Speech API.

### 2.4 Módulo Paleoecológico
- **Deriva Continental Interativa:** Visualização da fragmentação da *Pangeia* (Triássico) em *Laurásia* e *Gondwana* (Jurássico) até a abertura do Oceano Atlântico Sul (Cretáceo), com geolocalização dos sítios de fósseis.
- **Simulador Trófico Mesozoico:** Ajuste de biomassa vegetal, oxigênio, temperatura média e vulcanismo (*Trapps de Deccan*), com botão de simulação do cataclismo do **Asteroide de Chicxulub (limite K-Pg)** e análise do colapso da cadeia alimentar.

### 2.5 Quizzes Educativos e Gamificação
- Perguntas com calibragem automática baseada na faixa etária ativa.
- Sistema de pontuação, sequências de acertos (*streaks*), confetes comemorativos e sintetizador de áudio Web Audio API (sem dependências externas).
- Badges desbloqueáveis: *"Primeiro Fóssil"*, *"Mestre do Mesozoico"*, *"Guardião Brasileiro"* e *"Curador Honorário"*.

### 2.6 Fórum Moderado com RBAC
- Categorias temáticas: *Descobertas*, *Dúvidas Escolares*, *Debates Científicos* e *Fósseis no Brasil*.
- Controle de acesso baseado em papéis: **Aluno**, **Professor**, **Paleontólogo Curador** e **Administrador**.
- Selo de autenticação: *"Verificado por Paleontólogo"*.

### 2.7 Painel Administrativo de Curadoria Paleontológica
- Formulário para catalogação de novos espécimes com triplas de linguagem obrigatórias.
- **Sincronizador PBDB (Paleobiology Database):** Importação e integração direta com a API pública global de ocorrências fósseis (`https://paleobiodb.org/data1.2/occs/list.json`).
- **Dashboard de Saúde e SLAs:** Monitoramento de latência (<300ms SLA), disponibilidade (99.9%), e conformidade RTO (&lt;1h) / RPO (&lt;15min).

---

## 3. Arquitetura do Sistema e Stack Tecnológico

| Camada | Tecnologia Adotada | Finalidade no Projeto |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) + TypeScript | SSR, SSG e rotas de borda |
| **Renderização 3D** | Three.js / React Three Fiber (R3F) | Modelos anatômicos 3D e comparação de escala |
| **Gerenciamento de Estado** | Zustand | Estado reativo de faixa etária, 3D e gamificação |
| **Estilização & UI** | Tailwind CSS v4 + Lucide Icons | Design moderno, responsivo e temático de museu |
| **Acessibilidade** | WCAG 2.1 AA Compliant | Alto contraste, escalonamento de fontes e TTS |
| **Banco Relacional** | SQLite | Persistência local rápida de táxons e discussões |
| **ORM / Migrations** | Prisma ORM 6.4 | Modelagem tipada, migrations e seeds |
| **Protocolos de API** | REST + GraphQL Schema Engine | Endpoints flexíveis para consulta filogenética |
| **Integração Externa** | PBDB REST API | Ocorrências paleobiológicas em tempo real |
| **Monitoramento** | `/api/healthz` e `/api/readyz` | Checagem de disponibilidade compatível com Prometheus |

---

## 4. Estrutura de Diretórios

```
ceub_projeto_seminario_web_2026/
├── prisma/
│   ├── schema.prisma        # Modelagem de dados (Species, ForumTopic, QuizQuestion, etc.)
│   └── seed.ts              # Povoamento inicial com espécies brasileiras e mundiais
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-explain/  # Gerador adaptativo por IA (Infantil, Escolar, Acadêmico)
│   │   │   ├── forum/       # API do fórum moderado RBAC
│   │   │   ├── graphql/     # Endpoint GraphQL de dados taxonômicos
│   │   │   ├── healthz/     # Liveness probe compatível com Prometheus (< 300ms)
│   │   │   ├── pbdb/        # Sincronizador de dados do Paleobiology Database
│   │   │   ├── quiz/        # API de perguntas e validação de respostas
│   │   │   ├── readyz/      # Readiness probe
│   │   │   └── species/     # CRUD de espécies e fichas taxonômicas
│   │   ├── catalogo/        # Página do Catálogo Científico Dinâmico
│   │   ├── curadoria/       # Painel Administrativo e Curadoria
│   │   ├── especie/[id]/    # Ficha Técnica e Laboratório 3D
│   │   ├── forum/           # Página da Comunidade Paleontológica
│   │   ├── paleoecologia/   # Deriva Continental e Simulador Trófico
│   │   ├── quiz/            # Modo Gamificado e Desafios
│   │   ├── globals.css      # Estilos globais e modo de Alto Contraste
│   │   ├── layout.tsx       # Root Layout e meta tags
│   │   └── page.tsx         # Homepage DinoPédia
│   ├── components/
│   │   ├── 3d/              # Dinosaur3DViewer (Three.js WebGL interativo)
│   │   ├── ai/              # AIExplainerBox (Pedagogical Language Generator)
│   │   └── layout/          # Navbar, Footer e ClientShell de acessibilidade
│   └── lib/
│       ├── prisma.ts        # Singleton de conexão SQLite
│       ├── sound.ts         # Sintetizador Web Audio API e TTS
│       └── store.ts         # Store Zustand unificada
└── package.json
```

---

## 5. Como Executar o Projeto Localmente (via NVM)

### Pré-requisitos
- **NVM (Node Version Manager):** [nvm-windows](https://github.com/coreybutler/nvm-windows) instalado no sistema.
- Versão do Node.js definida no arquivo `.nvmrc` (`26.13.1` ou superior compatível com Next.js 16).

---

### Executando com o NVM (Passo a Passo)

1. **Ativar a versão correta do Node via NVM:**
   O projeto contém o arquivo `.nvmrc` configurado para a versão `26.13.1`.
   ```bash
   # No Prompt de Comando (CMD) ou PowerShell:
   nvm use 26.13.1
   ```
   > Caso não tenha a versão instalada ainda, execute:
   > ```bash
   > nvm install 26.13.1
   > nvm use 26.13.1
   > ```

2. **Verificar a versão ativa:**
   ```bash
   node -v
   # Deve retornar v26.13.1
   npm -v
   # Deve retornar 11.20.0
   ```

3. **Instalar as dependências (se necessário):**
   ```bash
   npm install
   ```

4. **Sincronizar o Banco de Dados SQLite e Rodar o Seed:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: **`http://localhost:3000`**.

> **Nota sobre PowerShell no Windows:**  
> Caso o PowerShell bloqueie a execução de scripts do `npm` (`PSSecurityException`), execute pelo **CMD** ou habilite a política no PowerShell do seu usuário:  
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`  
> Ou execute chamando explicitamente `npm.cmd run dev`.

6. **Gerar Build de Produção:**
   ```bash
   npm run build
   npm run start
   ```

---

## 6. Endpoints de Teste e Validação

- **Catálogo REST:** `http://localhost:3000/api/species`
- **GraphQL Schema:** `http://localhost:3000/api/graphql`
- **Sincronizador PBDB:** `http://localhost:3000/api/pbdb`
- **Health Check (SLA <300ms):** `http://localhost:3000/api/healthz`
- **Readiness Check:** `http://localhost:3000/api/readyz`

---

*DinoPédia © 2026 — Desenvolvido por Gabriel Caramez e Gabriel Pereira Garcia.*
