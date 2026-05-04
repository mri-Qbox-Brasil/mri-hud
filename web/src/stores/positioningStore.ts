import { create } from "zustand";

const LS_KEY = "PSHudPositioning";

export interface ElementState {
    dx: number;
    dy: number;
    hidden: boolean;
    vertical?: boolean;
    scale?: number;
}

export interface GaugeOverride {
    x?: number;
    y?: number;
    isShowing: boolean;
    scale?: number;
}

export interface ElementPermission {
    canMove: boolean;
    canHide: boolean;
    canResize?: boolean;
}

interface PositioningState {
    active: boolean;
    enabled: boolean;
    permissions: Record<string, ElementPermission>;
    elements: Record<string, ElementState>;
    gaugeOverrides: Record<string, GaugeOverride>;
    toggle: () => void;
    move: (id: string, dx: number, dy: number) => void;
    toggleHidden: (id: string) => void;
    toggleVertical: (id: string) => void;
    rescale: (id: string, scale: number) => void;
    rescaleGauge: (id: string, scale: number) => void;
    reset: (id: string) => void;
    resetAll: () => void;
    setConfig: (cfg: { enabled?: boolean; elements?: Record<string, ElementPermission> }) => void;
    setGaugePosition: (id: string, x: number, y: number) => void;
    setGaugeVisibility: (id: string, isShowing: boolean) => void;
    resetGauge: (id: string) => void;
}

interface SavedState {
    elements: Record<string, ElementState>;
    gaugeOverrides: Record<string, GaugeOverride>;
}

function load(): SavedState {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return { elements: {}, gaugeOverrides: {} };
        const parsed = JSON.parse(raw);
        // Backward compat: old format stored elements directly at root
        if ("elements" in parsed || "gaugeOverrides" in parsed) {
            return {
                elements: parsed.elements ?? {},
                gaugeOverrides: parsed.gaugeOverrides ?? {},
            };
        }
        return { elements: parsed, gaugeOverrides: {} };
    } catch {
        return { elements: {}, gaugeOverrides: {} };
    }
}

function persist(elements: Record<string, ElementState>, gaugeOverrides: Record<string, GaugeOverride>) {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ elements, gaugeOverrides })); } catch { }
}

const blank = (): ElementState => ({ dx: 0, dy: 0, hidden: false });
const initial = load();

export const usePositioningStore = create<PositioningState>((set) => ({
    active: false,
    enabled: true,
    permissions: {},
    elements: initial.elements,
    gaugeOverrides: initial.gaugeOverrides,

    toggle() {
        set((s) => ({ active: !s.active }));
    },

    move(id, dx, dy) {
        set((s) => {
            const elements = { ...s.elements, [id]: { ...(s.elements[id] ?? blank()), dx, dy } };
            persist(elements, s.gaugeOverrides);
            return { elements };
        });
    },

    rescale(id, scale) {
        set((s) => {
            const clamped = Math.round(Math.max(0.3, Math.min(3.0, scale)) * 100) / 100;
            const elements = { ...s.elements, [id]: { ...(s.elements[id] ?? blank()), scale: clamped } };
            persist(elements, s.gaugeOverrides);
            return { elements };
        });
    },

    rescaleGauge(id, scale) {
        set((s) => {
            const clamped = Math.round(Math.max(0.3, Math.min(3.0, scale)) * 100) / 100;
            const gaugeOverrides = {
                ...s.gaugeOverrides,
                [id]: { ...(s.gaugeOverrides[id] ?? { isShowing: true }), scale: clamped },
            };
            persist(s.elements, gaugeOverrides);
            return { gaugeOverrides };
        });
    },

    toggleHidden(id) {
        set((s) => {
            const cur = s.elements[id] ?? blank();
            const elements = { ...s.elements, [id]: { ...cur, hidden: !cur.hidden } };
            persist(elements, s.gaugeOverrides);
            return { elements };
        });
    },

    toggleVertical(id) {
        set((s) => {
            const cur = s.elements[id] ?? blank();
            const elements = { ...s.elements, [id]: { ...cur, vertical: !cur.vertical } };
            persist(elements, s.gaugeOverrides);
            return { elements };
        });
    },

    reset(id) {
        set((s) => {
            const { [id]: _, ...elements } = s.elements;
            persist(elements, s.gaugeOverrides);
            return { elements };
        });
    },

    resetAll() {
        persist({}, {});
        set({ elements: {}, gaugeOverrides: {} });
    },

    setConfig({ enabled, elements }) {
        set((s) => ({
            enabled: enabled ?? s.enabled,
            permissions: elements ?? s.permissions,
        }));
    },

    setGaugePosition(id, x, y) {
        set((s) => {
            const gaugeOverrides = {
                ...s.gaugeOverrides,
                [id]: { ...(s.gaugeOverrides[id] ?? { isShowing: true }), x, y },
            };
            persist(s.elements, gaugeOverrides);
            return { gaugeOverrides };
        });
    },

    setGaugeVisibility(id, isShowing) {
        set((s) => {
            const gaugeOverrides = {
                ...s.gaugeOverrides,
                [id]: { ...(s.gaugeOverrides[id] ?? {}), isShowing },
            };
            persist(s.elements, gaugeOverrides);
            return { gaugeOverrides };
        });
    },

    resetGauge(id) {
        set((s) => {
            const { [id]: _, ...gaugeOverrides } = s.gaugeOverrides;
            persist(s.elements, gaugeOverrides);
            return { gaugeOverrides };
        });
    },
}));
