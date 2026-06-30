# Handoff: HUD digital de carro (FiveM)

## Overview
HUD de painel de veículo para um servidor FiveM, em estilo digital/tech ciano. Mostra
velocidade, RPM/marcha, combustível, saúde do motor, turbo, cinto de segurança, bússola
e mini-mapa. Foram desenhados **3 formatos de velocímetro** entre os quais escolher:
`ring` (mostrador circular), `arc` (arco semicircular) e `linear` (número grande + barra).

O objetivo deste handoff é **recriar este design no script de HUD React + Tailwind + shadcn
que você já tem** — reaproveitando os componentes e padrões do seu projeto. Os valores
(velocidade, RPM, etc.) no seu projeto devem vir das mensagens NUI do FiveM
(`window.addEventListener('message', ...)`), não da animação de demonstração descrita aqui.

## About the Design Files
Os arquivos `.dc.html` neste bundle são **referências de design feitas em HTML** —
protótipos que mostram a aparência e o comportamento pretendidos, **não** código de produção
para copiar diretamente. A tarefa é reproduzir esse visual no seu codebase React/Tailwind/shadcn,
usando seus padrões existentes (componentes, tokens, utilitários).

- `CarHud.dc.html` — o componente da HUD em si (lógica de animação de demo + os 3 variants).
- `HUD FiveM.dc.html` — uma "tela de conceitos" que mostra os 3 variants lado a lado.
- `screenshots/` — renders dos 3 formatos.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamentos e proporções são finais.
Reproduza pixel-a-pixel usando seu design system. Onde houver conflito, prefira os tokens
do seu projeto, mas mantenha a hierarquia visual e as proporções descritas abaixo.

---

## Layout geral

A HUD ocupa a tela inteira do NUI (fundo transparente em produção — em FiveM o jogo aparece
atrás; aqui usamos um gradiente escuro só de placeholder). Dois grupos posicionados:

- **Mini-mapa** — `position: absolute; left: 22px; bottom: 22px;` — 128×128px.
- **Cluster central** — `position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%);`
  com `flex-direction: column; align-items: center; gap: 16px;`. De cima pra baixo:
  1. Fita de bússola (236×34px)
  2. Linha de gauges (`flex; align-items: center; gap: 24px`): trilho esquerdo (fuel+eng) · velocímetro · trilho direito (turbo+belt)
  3. Linha do tacômetro (marcha · segmentos de RPM · número de RPM)

Em produção remova o gradiente de fundo e o placeholder de "LIVE GAMEPLAY" — o `<body>` do NUI
deve ser transparente.

---

## Design Tokens

### Cores
| Token | Hex | Uso |
|---|---|---|
| accent (ciano) | `#46e0ff` | destaque principal: anel/arco/barra de velocidade, agulha do mapa, turbo, cinto, marcador da bússola |
| warning | `#ffc24d` | barra fuel/eng em nível médio (≤50%); penúltimos segmentos do RPM |
| danger | `#ff5a52` | barra fuel/eng em nível baixo (≤22%); zona vermelha do RPM (2 últimos segmentos) |
| texto primário | `#ffffff` | números grandes e valores |
| texto secundário | `rgba(255,255,255,0.5)` | rótulos KM/H, etc. |
| texto terciário | `rgba(255,255,255,0.45)` / `0.4` | labels FUEL/ENG/TURBO/GEAR/RPM |
| trilho vazio | `rgba(255,255,255,0.08)` | fundo das barras e do anel |
| segmento RPM apagado | `rgba(255,255,255,0.10)` | |
| glow ciano | `rgba(70,224,255,0.32)` | text-shadow do número de velocidade |

A cor accent é um **prop** (`accent`, default `#46e0ff`) — torne-a configurável.

### Tipografia
- Família: **Chakra Petch** (Google Fonts), pesos 400/500/600/700. Fallback `sans-serif`.
- Número da velocidade: `600`, `60px` (ring) / `56px` (arc) / `72px` (linear), `line-height ~0.8`, `text-shadow: 0 0 22px rgba(70,224,255,0.32)`.
- Rótulo "KM/H": `500`, `10px`, `letter-spacing: 0.32em`.
- RPM: `600 16px`; marcha (gear): `700 22px`.
- Labels (FUEL/ENG/TURBO): `500 9px`, `letter-spacing: 0.16em`, uppercase.
- Bússola majors (N/NE/E…): `600 10px`.

### Outros
- Border-radius cards: `5–7px`. Barras: `4–5px`. Pílula do cinto: `20px`.
- Sombra card: `0 16px 44px rgba(0,0,0,0.4)`; mini-mapa `0 10px 28px rgba(0,0,0,0.45)`.

---

## Componentes (detalhe)

### Velocímetro — variant `ring`
- Container `206×206px`, `position: relative`.
- Anel via `conic-gradient(accent <pct>%, rgba(255,255,255,0.07) 0)` com máscara
  `radial-gradient(circle, transparent 80px, #000 81px)` (cria o "donut"). `<pct>` = velocidade/200 × 100.
- Centro: número + "KM/H" centralizados (flex column).
- No React/Tailwind: use uma `div` com `style` para o conic-gradient + máscara (Tailwind não tem
  utilitário pra conic mask), ou um `<svg>` com `stroke-dasharray`. SVG é mais robusto.

### Velocímetro — variant `arc`
- "Meio donut": container `280×140px` com `overflow: hidden`; dentro, círculo `280×280px`
  com `conic-gradient(from -90deg, accent <pctArc>%, ...)`, máscara `radial-gradient(transparent 108px, #000 109px)`.
  `<pctArc>` = velocidade/200 × 50 (só metade do círculo é visível).
- Número fica abaixo, com `margin-top: -50px` pra encaixar no arco.

### Velocímetro — variant `linear`
- Largura `280px`. Número `72px` + "KM/H" alinhados na baseline.
- Barra `height: 6px`, `radius: 4px`, fundo `rgba(255,255,255,0.08)`. Preenchimento `width: <pct>%`,
  `background: accent`, `box-shadow: 0 0 12px accent`, com ticks via
  `repeating-linear-gradient(90deg, rgba(8,11,15,0.85) 0 1px, transparent 1px 26px)`.

### Barras verticais (Fuel / Engine / Turbo)
- Trilho `7px` de largura, `78px` (fuel/eng) ou `60px` (turbo) de altura, `radius: 5px`.
- Preenchimento de baixo pra cima: `height: <valor>%`.
- Cor por nível (fuel/eng): `>50% → accent`, `>22% → #ffc24d`, senão `#ff5a52`. Turbo é sempre accent com glow.
- Acima: valor numérico (`600 10px`); abaixo: label.

### Tacômetro (segmentos de RPM)
- 10 segmentos, `width: 5px`, `radius: 2px`, alturas crescentes: `[9,11,13,15,17,19,21,23,25,27]px`, `gap: 3px`.
- Nº de segmentos acesos = `round(rpm/8000 × 10)`. Acesos: índices ≥8 → `#ff5a52`, índice 7 → `#ffc24d`, resto → accent.
  Apagados → `rgba(255,255,255,0.10)`.
- À esquerda: marcha + label GEAR; à direita: número de RPM + label RPM.

### Bússola (fita)
- Janela `236×34px`, `overflow: hidden`, com máscara de fade nas bordas (`linear-gradient` 90deg).
- Régua interna deslocada por `translateX(118 - heading×3 px)`. Ticks a cada 15° de 0 a 720°
  (duplicado pra dar loop); majors a cada 45° com label (N/NE/E/SE/S/SW/W/NW), altura 12px;
  minors altura 6px.
- Marcador central fixo: linha vertical accent + triângulo apontando pra baixo em `left: 118px`.

### Mini-mapa
- `128×128px`, `radius: 7px`, fundo `#0c1219`, borda `1px rgba(70,224,255,0.18)`.
- Grade via dois `repeating-linear-gradient` (linhas a cada 21px). Seta do player no centro,
  triângulo accent rotacionado por `heading`. "N" no topo, "MAP" no canto.
- Em produção do FiveM o mini-mapa real do jogo é nativo — provavelmente você só posiciona/dimensiona
  o minimap do GTA via natives e este card é apenas a moldura. Trate como placeholder.

### Cinto (belt)
- Pílula `radius: 20px`, fundo `rgba(70,224,255,0.1)`, borda `rgba(70,224,255,0.32)`,
  ponto accent com glow + texto "BELT". Quando o cinto estiver solto, troque para a cor `danger`.

---

## State / dados (em produção)
No seu script real, **não** use a animação de demo. Os valores devem vir do NUI:

```js
// valores que a HUD consome
{ speed, rpm, gear, fuel, engineHealth, turbo, heading, seatbelt, minimapVisible }
```

Recebidos via `window.addEventListener('message', e => setData(e.data))`, enviados pelo
client Lua com `SendNUIMessage({...})` a cada frame/tick. Mapeie:
- `speed` 0–200 km/h (ajuste o máximo conforme seu servidor; o design assume **MAX 200**)
- `rpm` 0–8000 (MAX 8000), `gear` inteiro
- `fuel`, `engineHealth`, `turbo` em 0–100
- `heading` 0–359° (graus de bússola)
- `seatbelt` boolean, `minimapVisible` boolean

A lógica de demo (em `CarHud.dc.html`) só existe para visualizar o movimento; ela deriva
gear/rpm/boost de uma onda senoidal — pode ignorar essa parte.

## Lógica derivada (reaproveite no React)
```js
const speedFrac = speed / 200;          // → preenchimento do velocímetro
const rpmFrac   = rpm / 8000;
const litSegments = Math.round(rpmFrac * 10);
const segColor = (i, lit) => i >= lit ? 'rgba(255,255,255,0.10)'
                  : i >= 8 ? '#ff5a52' : i >= 7 ? '#ffc24d' : accent;
const barColor = p => p > 50 ? accent : p > 22 ? '#ffc24d' : '#ff5a52';
const compassX = 118 - heading * 3;     // px de translateX da régua da bússola
```

## Props sugeridos pro componente React
- `variant: 'ring' | 'arc' | 'linear'` (default `'ring'`)
- `accent: string` (default `'#46e0ff'`)
- `showMinimap: boolean` (default `true`)
- `data: { speed, rpm, gear, fuel, engineHealth, turbo, heading, seatbelt }`

## Notas de implementação (React + Tailwind + shadcn)
- **Conic-gradient + máscara**: Tailwind não cobre bem; prefira reescrever ring/arc como `<svg>`
  com `<circle>` + `stroke-dasharray`/`stroke-dashoffset` (mais previsível e animável com `transition`).
- shadcn não tem um "gauge" pronto; estes são componentes custom. Use shadcn só pra primitives
  que você já tenha (ex.: nada obrigatório aqui).
- Carregue Chakra Petch no seu `index.html`/layout, ou adicione ao `tailwind.config` como `fontFamily`.
- Anime transições de valor com `transition-[width,height] duration-150 ease-out` em vez de um
  `requestAnimationFrame` — os updates já chegam do NUI a cada tick.
- `<body>` do NUI transparente; remova o gradiente de placeholder.

## Files
- `CarHud.dc.html` — componente da HUD (lógica + 3 variants).
- `HUD FiveM.dc.html` — 3 conceitos lado a lado.
- `screenshots/concepts.png`, `screenshots/v.png` — renders de referência.
