// Registro imperativo (fora do React, sem reatividade) dos bounds atuais de
// cada DraggableHudElement na tela. Usado durante o arraste no modo
// posicionamento pra fazer snapping de alinhamento entre elementos (bordas e
// centros), estilo ferramenta de design. Ler direto no onMove evita re-renders.

export type Bounds = { l: number; t: number; r: number; b: number };

const registry = new Map<string, Bounds>();

export function setElementBounds(id: string, b: Bounds) {
  registry.set(id, b);
}

export function removeElementBounds(id: string) {
  registry.delete(id);
}

/** Bounds de todos os elementos exceto `selfId` (o que esta sendo arrastado). */
export function getOtherBounds(selfId: string): Bounds[] {
  const out: Bounds[] = [];
  for (const [k, v] of registry) {
    if (k !== selfId) out.push(v);
  }
  return out;
}
