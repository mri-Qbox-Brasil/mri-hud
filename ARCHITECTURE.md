**ps-hud — Arquitetura (resumo técnico)**

## Visão geral

`ps-hud` é um recurso FiveM (QBCore) que fornece um HUD altamente
customizável. O front-end é uma aplicação **React + Vite + TypeScript** em
`web/`, compilada para `html/` que é carregada como NUI
(`ui_page 'html/index.html'`). O backend usa scripts Lua em `client/`,
`server/` e `shared/`.

## Componentes principais

- **`fxmanifest.lua`**: manifesto do recurso (carrega scripts Lua e `html/*`
  como arquivos UI). Usa `lua54`.
- **`client/main.lua`**: lógica do cliente — coleta dados do jogador (saúde,
  fome, sede, velocidade, combustível, etc.), escuta eventos do jogo, e envia
  atualizações para a UI via `SendNUIMessage`. Também registra callbacks NUI
  (`RegisterNUICallback`) para receber comandos do UI (salvar configurações,
  alternar opções, etc.).
- **`server/main.lua`**: lógica do servidor — valida permissões, salva
  configurações UI (`hud:server:saveUIData`), e fornece callbacks para
  recuperar a configuração (`hud:server:getMenu`), além de comandos de teste
  (`/cash`, `/bank`, `/dev`).
- **`shared/config.lua`** e **`shared/uiconfig.lua`**: constantes/configs
  globais (ex.: `Config.AdminOnly`, whitelists, limiares de stress, flags de
  vehicle HUD).
- **`web/`**: código-fonte React + Vite. Contém `src/` com `components/`,
  `stores/` (Zustand), `utils/`, `locale/`, `types/`. O `vite.config.ts` gera
  o build em `../html` (diretório final usado pelo FiveM).
- **`html/`**: resultado do build — é o que o jogo carrega como NUI.

## Comunicação (fluxo de dados)

### Lua (client) → UI via `SendNUIMessage`

O client envia mensagens com um campo `action` (e às vezes `topic`) que a UI
escuta via `window.addEventListener('message', ...)` em
`utils/eventHandler.ts` (`mainEvent()`). Todas as actions suportadas:

`hudtick`, `car`, `externalstatus`, `menu`, `panel`, `baseplate`, `open`,
`show`, `showconstant`, `update`, `updatemoney`, `updateUISettings`, `setLang`.

Cada action é roteada via `switch` pra um método `receive*Message()` no store
correspondente.

### UI → Lua via `fetchNui`

`fetchNui(eventName, data)` faz POST pra `https://ps-hud/<eventName>`. O
client registra `RegisterNUICallback('<event>', ...)` pra tratar. Contrato
completo dos eventos documentado em `nui-events.json`.

### UI state management (Zustand)

Stores em `web/src/stores/`:
- `playerStatusHudStore`, `vehicleHudStore`, `menuStore`, `colorEffectStore`,
  `layoutStore`, `profileStore`, `moneyHudStore`, `externalStatusStore`,
  `compassHudStore`, `dynamicPanelsStore`, `debugStore`.

Cada store factory:
1. Lê estado inicial do `localStorage` (keys: `PSHudMenu`, `PSHudPlayerStatus`,
   `PSHudLayout`, `PSHudColor`, `PSHudProfile`)
2. Cai em defaults hardcoded
3. Expõe `{ subscribe, set, update, ...domainMethods }`

## Sistema de shapes de ícone

`web/src/types/types.ts` define a hierarquia de tipos usada por todo ícone HUD:

- `baseIcon` → size, scaling, position, progress
- `ringIcon extends baseIcon` → ringSize, borderGap, displayOutline
- `fillIcon extends baseIcon` → borderSize
- `roundEndIcon extends baseIcon` → xAxisRound, yAxisRound, barHeight
- `notchedIcon extends ringIcon` → dashes, gap
- `pillRingIcon extends ringIcon` → pill-shaped ring

`createShapeIcon(shape, optionalProps)` é a factory única pras 26 shapes — mapeia
`shapekind` string pra classe certa com defaults. Sempre usar a factory, nunca
instanciar as classes direto.

Cada shape tem componente correspondente em `components/hud-shapes/`. São
componentes SVG puros que recebem props da shape e renderizam o visual.

`MetaShape` (`components/meta-shape.tsx`) é o dispatcher: dado um objeto
`hudIconInfo`, renderiza a shape correta via grande `if`/`switch`.

## Sistema de color effects

Cada ícone tem um array `colorEffects` (2–3 stages nomeados, ex: `alive`/`dead`
pra health) e um `currentEffect` index. `ColorEffectStore.updateIconEffectStage(iconName, stageIndex)`
muda o stage ativo. `playerStatusHudStore.receiveStatusUpdateMessage()` dispara
transições (ex: `armor <= 0` → stage 1 no armor).

## Visibilidade dinâmica de ícones

Ícones com `dynamicIcons[name] = true` somem quando estão no valor neutro
(health 100, armor 0, etc). A lógica fica em `playerStatusHudStore`:
`staticGenericHundredHandleShow`, `staticGenericZeroHandleShow`,
`staticEngineHandleShow`, `staticNitroHandleShow`.

## Painéis dinâmicos (feature de extensão)

`dynamicPanelsStore` + `components/dynamic-panels.tsx` permitem que outros
resources FiveM injetem painéis no HUD em runtime via
`SendNUIMessage({ action: "panel", topic: "add"|"remove"|"update"|"list", ... })`.
Cada painel pode renderizar `MetaShape` completo (via `hudIconInfo`) OU layout
simples icon+title+value.

## Debug mode

`web/src/stores/debugStore.ts` exporta um `boolean`. `web/scripts/toggleDebug.js`
reescreve esse arquivo antes do dev/build. Com `debugMode = true`, HUD e menu
ficam sempre visíveis independente do estado do jogo e progress anima
automaticamente.

## Layout presets

`LayoutStore` guarda um de 7 valores `layoutIconKind`. `meta-layout.tsx` mapeia
cada um pra um container com posicionamento absoluto. O layout `standard`
(canto inferior esquerdo) inclui um override `transform: scale(0.7)` em 1280×720.

## Compatibilidade com scripts de combustível

`client/main.lua` detecta automaticamente o fuel script rodando (`LegacyFuel`,
`ox-fuel`, `nd-fuel`, `frfuel`, `cdn-fuel`, `x-fuel`) e chama o export correto,
caindo no nativo `GetVehicleFuelLevel` como fallback.

## Persistência de configurações

O servidor pode gravar `shared/uiconfig.lua` (no evento `hud:server:saveUIData`)
pra persistir configs globais (quando `Config.AdminOnly` está ativo o server
impõe as configs). A UI também salva localmente em `localStorage` via
`saveUIDataToLocalStorage()`.

## Extensão / Integração

Pra integrar outros recursos com o HUD, duas abordagens:

1. **Enviar eventos para o HUD** (Lua → NUI) via `SendNUIMessage` com `action`
   e `topic` apropriados; a UI mapeia para os stores.
2. **Chamar endpoints NUI** (UI → Lua) via `fetchNui(eventName, data)` pra
   solicitar ações do client (por exemplo, `saveUISettings` chama o server
   pra gravar config).

## Arquivos a revisar para estender o HUD

- **Client (Lua):** `client/main.lua` — decide quando enviar mensagens,
  formata payloads e aceita callbacks do UI
- **Server (Lua):** `server/main.lua` — grava configs, valida permissões
- **Frontend:** `web/src/utils/eventHandler.ts` (rotea mensagens NUI pros
  stores), `web/src/stores/*` (estado), `web/src/components/*` (visual)

## Boas práticas

- Use `SendNUIMessage` sempre com `action` string e `topic` quando fizer
  sentido — facilita roteamento no `eventHandler`
- Ao adicionar endpoint NUI novo: adicione `RegisterNUICallback`
  correspondente em `client/main.lua` (ou server, se fizer sentido) e
  documente payload em `nui-events.json`
- Pra alterações no frontend, edite `web/src/` e rode `pnpm build` (gera
  `html/`) antes de testar no servidor FiveM

## Exemplos de payloads

**`hudtick` (Lua → NUI)** — status do jogador:
```json
{
  "action": "hudtick",
  "topic": "status",
  "show": true,
  "health": 86,
  "playerDead": false,
  "armor": 25,
  "thirst": 70,
  "hunger": 55,
  "stress": 10,
  "voice": 30,
  "radioChannel": 0,
  "radioTalking": false,
  "talking": false,
  "armed": true,
  "oxygen": 100,
  "parachute": -1,
  "nos": 0,
  "cruise": false,
  "nitroActive": false,
  "harness": false,
  "hp": 20,
  "speed": 0,
  "engine": 100,
  "cinematic": false,
  "dev": false
}
```

**`car` (Lua → NUI)** — exibição/status do veículo:
```json
{
  "action": "car",
  "topic": "status",
  "show": true,
  "isPaused": false,
  "seatbelt": false,
  "speed": 62,
  "fuel": 48,
  "altitude": 0,
  "showAltitude": false,
  "showSeatbelt": true,
  "showSquareB": false,
  "showCircleB": true,
  "useMPH": true
}
```

**`saveUISettings` (NUI → Lua)** — payload pra salvar configs (gerado por
`saveUIDataToServer()`):
```json
{
  "icons": {
    "health": { "shape": "circle-fill", "iconScaling": 1.0, "isShowing": true, "progressValue": 100 },
    "armor":  { "shape": "circle-ring", "isShowing": true, "progressValue": 50 }
  },
  "layout": {
    "layout": "standard",
    "iconBetweenSpacing": 10,
    "xAxisSpacing": 20,
    "yAxisSpacing": 2
  },
  "colors": {
    "health": { "colorEffects": [ { "progressColor": "#06d170" } ] },
    "armor":  { "colorEffects": [ { "progressColor": "#0764ce" } ] }
  }
}
```
