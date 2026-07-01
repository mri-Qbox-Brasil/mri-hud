import { create } from "zustand";

/**
 * Elementos customizados do painel DIGITAL do veiculo — mesma ideia dos custom
 * gauges/panels/orbs, mas encaixam no cluster digital (VehicleDigitalHud) e so
 * aparecem quando o tema digital esta ativo e o cluster visivel. Injetados por
 * outros resources via NUI:
 *
 *   SendNUIMessage({ action = 'digitalelement', topic = 'set',
 *     element = { id='nitro', kind='bar', label='NOS', value=80, color='#46e0ff', glow=true } })
 *   SendNUIMessage({ action = 'digitalelement', topic = 'value', id='nitro', value=40 })
 *   SendNUIMessage({ action = 'digitalelement', topic = 'remove', id='nitro' })
 *
 * kind:
 *   'bar'  = barra vertical (igual FUEL/ENG/TURBO) — usa `value` 0..100
 *   'pill' = pilula/badge com ponto (igual BELT) — usa `text`, aceso quando `value`>0
 *   'text' = leitura numero grande + label (igual GEAR/RPM) — usa `value`/`text`
 *
 * Posicao/visibilidade/escala via DraggableHudElement (id `digitalEl_<id>`).
 */
export interface DigitalElement {
  id: string;
  label: string;
  kind: "bar" | "pill" | "text";
  value: number;   // bar (0..100) / pill (aceso se >0) / text (numero exibido)
  text: string;    // texto exibido em 'pill'/'text' (sobrepoe o numero se presente)
  color: string;   // hex; "" => usa o accent do tema
  glow: boolean;
  // Ancora default do cluster (mesma convencao dos DigitalEl nativos).
  left: string;    // ex: "calc(50% + 220px)"
  bottom: number;  // px
  isShowing: boolean;
}

type ElementMap = Record<string, DigitalElement>;

interface CustomDigitalState {
  elements: ElementMap;
  setElement: (el: Partial<DigitalElement> & { id: string }) => void;
  updateValue: (id: string, value: number) => void;
  removeElement: (id: string) => void;
  setAll: (elements: Array<Partial<DigitalElement> & { id: string }>) => void;
  clear: () => void;
}

const defaults: Omit<DigitalElement, "id"> = {
  label: "",
  kind: "bar",
  value: 0,
  text: "",
  color: "",
  glow: false,
  left: "calc(50% + 220px)",
  bottom: 108,
  isShowing: true,
};

function merge(id: string, incoming: Partial<DigitalElement>, existing?: DigitalElement): DigitalElement {
  return { ...defaults, ...(existing ?? {}), ...incoming, id };
}

export const useCustomDigitalStore = create<CustomDigitalState>((set) => ({
  elements: {},

  setElement(el) {
    set((state) => ({ elements: { ...state.elements, [el.id]: merge(el.id, el, state.elements[el.id]) } }));
  },

  updateValue(id, value) {
    set((state) => {
      const cur = state.elements[id];
      if (!cur) return state;
      return { elements: { ...state.elements, [id]: { ...cur, value } } };
    });
  },

  removeElement(id) {
    set((state) => {
      const { [id]: _, ...rest } = state.elements;
      return { elements: rest };
    });
  },

  setAll(elements) {
    set((state) => {
      const map: ElementMap = {};
      for (const el of elements) map[el.id] = merge(el.id, el, state.elements[el.id]);
      return { elements: map };
    });
  },

  clear() {
    set({ elements: {} });
  },
}));
