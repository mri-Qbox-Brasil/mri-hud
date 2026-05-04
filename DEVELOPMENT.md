**Visão Geral**
- **Projeto:** `ps-hud` — HUD personalizável para FiveM (QBCore). UI desenvolvida em Svelte encontrada em `svelte-source` e compilada para `html/` (NUI).

**Requisitos**
- Node.js (>=16 recomendado) e um gerenciador de pacotes (`pnpm` recomendado, `npm` funciona).
- PowerShell no Windows (ou WSL / Git Bash para comandos Unix).
- FiveM server com `qb-core` e recursos opcionais mencionados no `fxmanifest.lua` (`InteractSound`, `pma-voice`, plugins de fuel opcionais).

**Estrutura importante**
- `client/`, `server/`, `shared/` — scripts Lua (FiveM resource).
- `html/` — build da UI (NUI) que o FiveM carrega (`ui_page 'html/index.html'`).
- `svelte-source/` — código-fonte Svelte/TypeScript (dev). O `vite.config.ts` já configura `outDir: "../html"` para o build.

**Instalação local (svelte-source)**
1. Abra PowerShell e entre na pasta `svelte-source`:
```
cd 'g:\\gt-scripts\\ps-hud\\svelte-source'
```
2. Instale dependências (use `pnpm` se disponível, ou `npm`):
```
pnpm install
# ou
npm install
```

**Scripts úteis**
- `npm run dev` — inicia Vite em modo desenvolvimento. O script agora ativa `debugMode` (via `node ./scripts/toggleDebug.js true`) antes de iniciar o servidor dev.
- `npm run build` — build de produção (executa `node ./scripts/toggleDebug.js false` e em seguida `vite build`). O bundle é gerado diretamente em `../html`.
- `npm run preview` — preview do build.
- `npm run check` — checagem TypeScript/Svelte.

Exemplo (PowerShell):
```
cd 'g:\\gt-scripts\\ps-hud\\svelte-source'
npm run dev
```

Observação: os scripts originais usavam `sed` para alternar `debugMode` — isso não era cross-platform. Adicionei `svelte-source/scripts/toggleDebug.js` e atualizei `package.json` para chamadas Node (`node ./scripts/toggleDebug.js true|false`).

**Build para produção**
```
cd 'g:\\gt-scripts\\ps-hud\\svelte-source'
npm run build
```
Isso produz os arquivos finais dentro de `g:\\gt-scripts\\ps-hud\\html` prontos para o FiveM (o `fxmanifest.lua` usa `ui_page 'html/index.html'`).

**Rodando no FiveM (servidor local)**
- Copie a pasta `ps-hud` para a pasta `resources` do seu servidor FiveM (ou mantenha no mesmo local se já estiver).
- No `server.cfg` do seu servidor, adicione `ensure ps-hud` ou `start ps-hud`.
- Reinicie o servidor FiveM ou carregue o recurso.

**Mensagens NUI / Endpoints (resumo de integração)**
O frontend Svelte comunica-se com os scripts Lua via NUI fetch para endpoints do resource (`https://ps-hud/<event>`). Os endpoints observados no código:
- `saveUISettings` — usado por `saveUIDataToServer()` para enviar `icons`, `layout`, `colors` ao servidor (`hud:server:saveUIData`).
- `updateMenuSettingsToClient` — utilizado para propagar definições do menu do UI para o client Lua.
- `closeMenu`, `openMenu` — ações de controle de foco/menu.

O Svelte também recebe mensagens vindas do client Lua via `window.postMessage`. As ações mapeadas no `src/utils/eventHandler.ts` incluem (entre outras):
- `baseplate` (topics: `compassupdate`, `opencompass`, `closecompass`)
- `car` (topics: `display`, `status`)
- `externalstatus` (topics: `buff`, `enhancement`)
- `hudtick` (topics: `display`, `status`)
- `menu` (topics: `adminonly`, `restart`)
- `open`, `show`, `showconstant`, `update`, `updatemoney`, `updateUISettings`, `setLang`

No lado Lua (client), procuram-se chamadas `SendNUIMessage(...)` e `RegisterNUICallback` para lidar com essas ações. Ex.: `SendNUIMessage({ action = 'menu', topic = 'adminonly', ... })` e `RegisterNUICallback('saveUISettings', ...)` (ver `client/main.lua`).

**Dependências principais (frontend)**
- `svelte`, `vite`, `vite-plugin-windicss`, `svelte-fa`, `svelte-select`, `@fortawesome/*`, `@neodrag/svelte`.

**Notas / Sugestões**
- O `vite.config.ts` já está configurado para gerar assets em `../html` — isso facilita deploy direto para o resource.
- Se você estiver no Windows e preferir não instalar `pnpm`, `npm` funciona. Para o `dev` mode real (hot reload), abra o navegador na URL que o Vite dev server expõe; no entanto, para testar no FiveM, prefira `npm run build` e reinicie o recurso no servidor FiveM.
- Posso (se desejar):
  - (A) Gerar um arquivo `README.dev.md` mais compacto dentro de `svelte-source` com comandos rápidos, ou
  - (B) Tornar `toggleDebug.js` mais resiliente (backups, suporte a caminhos personalizados), ou
  - (C) Gerar um mapa de eventos NUI completo como JSON para integrar com outros recursos.

**Próximos passos que eu já iniciei**
- Analisei stores e componentes principais e atualizei os scripts para serem cross-platform. Estou preparando um resumo de arquitetura e um mapeamento mais detalhado das integrações (se quiser, gero o JSON de mensagens NUI agora).

---
Arquivo criado automaticamente para desenvolvimento. Se quiser que eu crie um `README.dev.md` dentro de `svelte-source` com comandos de exemplo e checagens extra (ex.: verificação de `GetResourceState` no FiveM), eu posso gerar agora.

**Referência de eventos NUI**
- O repositório inclui um mapeamento completo das mensagens NUI em `nui-events.json` (raí z do projeto). Ele descreve os eventos enviados do Lua para a UI (`lua_to_nui`) e os callbacks registrados pelo client Lua para eventos vindos da UI (`nui_to_lua`), com os campos/payloads esperados.

- Caminho: `./nui-events.json`

- Uso rápido:
  - Integração com outros recursos: abra `nui-events.json` e procure a ação desejada (por exemplo `hudtick` ou `car`) para ver o payload esperado antes de chamar `SendNUIMessage`.
  - Validação rápida: você pode inspecionar o JSON ou usar uma ferramenta (ex.: `jq`, um validador JSON Schema) para confirmar a forma do payload.

- Se quiser, eu crio um pequeno utilitário Node que valide um objeto JS contra `nui-events.json` (opção útil para integradores). Basta pedir.
