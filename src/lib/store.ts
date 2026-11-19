import { create } from "zustand";

export type AgeLevel = "infantil" | "escolar" | "academico";
export type UserRole = "Aluno" | "Professor" | "Paleontólogo Curador" | "Administrador";
export type Layer3D = "all" | "skeleton" | "muscles" | "integument";
export type ScaleTarget = "none" | "human" | "car" | "elephant" | "ostrich" | "crocodile";
export type LightingMode = "daylight" | "museum" | "sunset";

export interface GamificationState {
  score: number;
  streak: number;
  unlockedBadges: string[];
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockBadge: (badgeId: string) => void;
}

interface AppStore {
  // ADR-002 Faixa Etária
  ageLevel: AgeLevel;
  setAgeLevel: (level: AgeLevel) => void;

  // RBAC Papel do Usuário
  userRole: UserRole;
  userName: string;
  setUserRole: (role: UserRole) => void;
  setUserName: (name: string) => void;

  // ADR-001 Visualizador 3D
  current3DLayer: Layer3D;
  set3DLayer: (layer: Layer3D) => void;
  scaleTarget: ScaleTarget;
  setScaleTarget: (target: ScaleTarget) => void;
  lightingMode: LightingMode;
  setLightingMode: (mode: LightingMode) => void;
  wireframe: boolean;
  toggleWireframe: () => void;

  // Acessibilidade WCAG 2.1
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: "normal" | "large" | "extra-large";
  setFontSize: (size: "normal" | "large" | "extra-large") => void;
  ttsEnabled: boolean;
  toggleTTS: () => void;

  // Gamificação
  score: number;
  streak: number;
  unlockedBadges: string[];
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockBadge: (badgeId: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Faixa etária padrão: Curioso/Escolar
  ageLevel: "escolar",
  setAgeLevel: (level) => set({ ageLevel: level }),

  // Papel padrão
  userRole: "Aluno",
  userName: "Estudante Explorador",
  setUserRole: (role) => set({ userRole: role }),
  setUserName: (name) => set({ userName: name }),

  // Visualizador 3D
  current3DLayer: "all",
  set3DLayer: (layer) => set({ current3DLayer: layer }),
  scaleTarget: "human",
  setScaleTarget: (target) => set({ scaleTarget: target }),
  lightingMode: "museum",
  setLightingMode: (mode) => set({ lightingMode: mode }),
  wireframe: false,
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),

  // Acessibilidade
  highContrast: false,
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  fontSize: "normal",
  setFontSize: (size) => set({ fontSize: size }),
  ttsEnabled: false,
  toggleTTS: () => set((state) => ({ ttsEnabled: !state.ttsEnabled })),

  // Gamificação
  score: 150,
  streak: 2,
  unlockedBadges: ["primeiro_fossil", "explorador_mesozoico"],
  addPoints: (points) => set((state) => ({ score: state.score + points })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
  unlockBadge: (badgeId) =>
    set((state) =>
      state.unlockedBadges.includes(badgeId)
        ? state
        : { unlockedBadges: [...state.unlockedBadges, badgeId] }
    ),
}));
