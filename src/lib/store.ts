import { create } from 'zustand';
import { PlanetData } from './planetData';

interface Store {
  selectedPlanet: PlanetData | null;
  setSelectedPlanet: (p: PlanetData | null) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (id: string | null) => void;
  timeSpeed: number;
  setTimeSpeed: (s: number) => void;
  paused: boolean;
  togglePause: () => void;
  showOrbits: boolean;
  toggleOrbits: () => void;
  showLabels: boolean;
  toggleLabels: () => void;
  showGrid: boolean;
  toggleGrid: () => void;
  showAsteroidBelt: boolean;
  toggleAsteroidBelt: () => void;
  focusedPlanet: string | null;
  setFocusedPlanet: (id: string | null) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  view: 'solar' | 'top' | 'free';
  setView: (v: 'solar' | 'top' | 'free') => void;
  timeElapsed: number;
  setTimeElapsed: (t: number) => void;
}

export const useStore = create<Store>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (p) => set({ selectedPlanet: p, sidebarOpen: !!p }),
  hoveredPlanet: null,
  setHoveredPlanet: (id) => set({ hoveredPlanet: id }),
  timeSpeed: 365,
  setTimeSpeed: (s) => set({ timeSpeed: s }),
  paused: false,
  togglePause: () => set((s) => ({ paused: !s.paused })),
  showOrbits: true,
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
  showLabels: true,
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  showGrid: false,
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  showAsteroidBelt: true,
  toggleAsteroidBelt: () => set((s) => ({ showAsteroidBelt: !s.showAsteroidBelt })),
  focusedPlanet: null,
  setFocusedPlanet: (id) => set({ focusedPlanet: id }),
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  view: 'free',
  setView: (v) => set({ view: v }),
  timeElapsed: 0,
  setTimeElapsed: (t) => set({ timeElapsed: t }),
}));
