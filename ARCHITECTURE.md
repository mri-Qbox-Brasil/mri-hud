**ps-hud — Arquitetura (resumo técnico)**

Visão geral
- `ps-hud` é um recurso FiveM (QBCore) que fornece um HUD altamente customizável. O front-end é uma aplicação Svelte (TypeScript) em `svelte-source/`, compilada para `html/` que é carregada como NUI (`ui_page 'html/index.html'`). O backend usa scripts Lua em `client/`, `server/` e `shared/`.

Componentes principais
- `fxmanifest.lua`: manifesto do recurso (carrega scripts Lua e `html/*` como arquivos UI). Usa `lua54`.
- `client/main.lua`: lógica do cliente — coleta dados do jogador (saúde, fome, sede, velocidade, combustível, etc.), escuta eventos do jogo, e envia atualizações para a UI via `SendNUIMessage`. Também registra callbacks NUI (`RegisterNUICallback`) para receber comandos do UI (salvar configurações, alternar opções, etc.).
- `server/main.lua`: lógica do servidor — valida permissões, salva configurações UI (`hud:server:saveUIData`), e fornece callbacks para recuperar a configuração (`hud:server:getMenu`), além de comandos de teste (`/cash`, `/bank`, `/dev`).
- `shared/config.lua`: constantes e opções globais (ex.: `Config.AdminOnly`, whitelists, limiares de stress, flags de vehicle HUD).
- `svelte-source/`: código fonte Svelte + Vite. Contém `src/` com `components/`, `stores/`, `utils/` e `locale/`. O `vite.config.ts` gera o build em `../html` (diretório final usado pelo FiveM).
- `html/`: resultado do build Svelte — é o que o jogo carrega como NUI.

Comunicação (fluxo de dados)
- Lua (client) → UI (NUI): via SendNUIMessage
  - O client envia mensagens com um campo `action` (e às vezes `topic`) que a UI escuta com `window.addEventListener('message', ...)` no `EventHandler` do Svelte.
  - Exemplos de mensagens enviadas: `hudtick` (status do jogador), `car` (status do veículo), `externalstatus` (buffs/enhancements), `menu` (admin/restart), `open`/`show`/`update` etc.

- UI → Lua: via fetch NUI (`fetch('https://ps-hud/<event>')`)
  - O utilitário `fetchNui` em `src/utils/eventHandler.ts` faz POST para endpoints do recurso (ex.: `saveUISettings`, `resetStorage`, e muitos outros). O client registra `RegisterNUICallback('<event>', ...)` para tratá-los.

- UI state management
  - A UI mantém estado no conjunto de `stores` (Svelte stores) em `svelte-source/src/stores/`: `playerStatusHudStore`, `vehicleHudStore`, `menuStore`, `colorEffectStore`, `layoutStore`, `profileStore`, `moneyHudStore`, `externalStatusStore`, `compassHudStore`.
  - `EventHandler()` conecta `window.postMessage` (NUI messages) aos métodos `receive...Message` dos stores.

Persistência de configurações
- O servidor pode gravar `uiconfig.lua` (no evento `hud:server:saveUIData`) para persistir configurações globais (quando `Config.AdminOnly` está ativo o servidor impõe as configurações). A UI também salva localmente em `localStorage` via `saveUIDataToLocalStorage()`.

Build / Dev
- `svelte-source/package.json` contém scripts `dev`, `build`, `preview`. O `vite` está configurado para gerar saída em `../html` com nomes sem hashes (para facilitar o uso direto pelo FiveM).
- Foi adicionado `svelte-source/scripts/toggleDebug.js` para ativar/desativar `debugMode` de maneira cross-platform antes de rodar `dev`/`build`.

Extensão / Integração
- Para integrar outros recursos com o HUD, existem duas abordagens:
  1. Enviar eventos para o HUD (client Lua → NUI) usando `SendNUIMessage` com o `action` e `topic` apropriados; a UI mapeará isso para as stores.
  2. Chamar endpoints NUI do HUD (UI → Lua) via `fetch('https://ps-hud/<event>')` para solicitar ações do client (por exemplo, `saveUISettings` chama servidor para gravar a configuração).

Arquivos a revisar para estender o HUD
- Client-side (Lua): `client/main.lua` — aqui são tomadas decisões sobre quando enviar mensagens, formatar payloads e aceitar callbacks do UI.
- Server-side (Lua): `server/main.lua` — grava configurações, valida permissões.
- Frontend: `svelte-source/src/utils/eventHandler.ts` — rota as mensagens da NUI para os stores; `svelte-source/src/stores/*` — a área principal para alterar exibição/estado; `svelte-source/src/components/*` — layout e componentes visuais.

Boas práticas
- Use `SendNUIMessage` sempre com um `action` (string) e `topic` quando necessário — facilita o roteamento no `EventHandler`.
- Ao adicionar um novo endpoint NUI, adicione um `RegisterNUICallback` correspondente no `client/main.lua` (ou no server, se fizer sentido) e documente o payload esperado.
- Para alterações no frontend, prefira editar os arquivos em `svelte-source/` e rodar `npm run build` para gerar `html/` antes de testar no servidor FiveM.

Exemplos de payloads
- `hudtick` (Lua -> NUI) — atualização do status do jogador:
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

- `car` (Lua -> NUI) — exibição / status do veículo:
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

- `saveUISettings` (NUI -> Lua) — payload enviado pela UI para salvar configurações (serializado pela função `saveUIDataToServer()`):
```json
{
  "icons": {
    "health": { "shape": "circle-fill", "iconScaling": 1.0, "isShowing": true, "progressValue": 100 },
    "armor": { "shape": "circle-ring", "isShowing": true, "progressValue": 50 }
    // ... outras chaves de ícones
  },
  "layout": {
    "layout": "standard",
    "iconBetweenSpacing": 10,
    "xAxisSpacing": 20,
    "yAxisSpacing": 2
  },
  "colors": {
    "health": { "colorEffects": [ { "progressColor": "#06d170" } ] },
    "armor": { "colorEffects": [ { "progressColor": "#0764ce" } ] }
  }
}
```
