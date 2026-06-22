# Desenvolvimento — ps-hud

HUD personalizável pra FiveM (QBCore). UI em **React + Vite + TypeScript**
em `web/`, compilada para `html/` (NUI).

## Requisitos

- Node.js ≥18 (recomendado 20+)
- `pnpm` (recomendado) ou `npm`
- FiveM server com `qb-core` e recursos opcionais mencionados no
  `fxmanifest.lua` (`InteractSound`, `pma-voice`, plugins de fuel)

## Estrutura

- `client/`, `server/`, `shared/` — scripts Lua do resource
- `html/` — build da UI (gerado por `pnpm build`, é o que o FiveM carrega)
- `web/` — código-fonte React + Vite (dev). `vite.config.ts` aponta
  `outDir: "../html"` pro build cair na raiz do resource

## Instalação local

```bash
cd web
pnpm install
```

## Scripts

Todos rodados de dentro de `web/`:

| Script | O que faz |
|---|---|
| `pnpm dev` | Inicia Vite em modo desenvolvimento. Ativa `debugMode` (via `node ./scripts/toggleDebug.js true`) antes |
| `pnpm build` | Build de produção. Desativa `debugMode` e roda `vite build`. Output direto em `../html/` |
| `pnpm preview` | Preview do build local |
| `pnpm check` | `tsc --noEmit` (type-check sem emitir) |

### Toggle de debugMode manual

```bash
node web/scripts/toggleDebug.js true   # ativa
node web/scripts/toggleDebug.js false  # desativa
```

> **Nota:** os scripts originais usavam `sed` (não cross-platform). Foram
> substituídos por `toggleDebug.js` (Node) pra funcionar no Windows também.

## Build pra produção

```bash
cd web
pnpm build
```

Gera `html/index.html` + `html/assets/*` prontos pro FiveM consumir via
`ui_page 'html/index.html'` declarado em `fxmanifest.lua`.

## Rodando no FiveM

1. Coloque a pasta `ps-hud` em `resources/`
2. Adicione `ensure ps-hud` no `server.cfg`
3. Reinicie ou recarregue o resource (`refresh; ensure ps-hud`)

## Eventos NUI

O contrato completo está em `nui-events.json` na raiz:

- **`lua_to_nui`**: eventos que o Lua envia pra UI via `SendNUIMessage`
  (`hudtick`, `car`, `menu`, `open`, etc.)
- **`nui_to_lua`**: callbacks que o client Lua registra pra eventos vindos
  da UI (`saveUISettings`, `closeMenu`, `openMenu`, etc.)

Pra integrar outro resource com o HUD:
1. Abra `nui-events.json`, procure a action desejada
2. Use o payload documentado em `SendNUIMessage` ou `fetchNui`

## Dependências principais (frontend)

`react` + `react-dom`, `vite`, `tailwindcss`, `zustand`, `@radix-ui/*`,
`@fortawesome/*` (icons), `lucide-react`, `d3-color`. Lista completa em
`web/package.json`.

## Testes

Não há testes automatizados. Validação é feita rodando o resource num server
FiveM (`ensure ps-hud` + entrar in-game).
