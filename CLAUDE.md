# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All frontend commands run from `web/` (the active React implementation):

```bash
# Development (auto-enables debugMode, starts Vite dev server)
cd web && pnpm run dev

# Production build (disables debugMode, outputs to ../html/)
cd web && pnpm run build

# Type-check without emitting
cd web && pnpm run check

# Toggle debug mode manually
node web/scripts/toggleDebug.js true   # enable
node web/scripts/toggleDebug.js false  # disable
```

> **Note:** `svelte-source/` is the legacy Svelte implementation. Its build now outputs to `svelte-source/html/` and does **not** touch `../html/`. Do not run builds from `svelte-source/` — use `web/` exclusively.

There are no automated tests. The FiveM resource is loaded by placing the root folder under `resources/` and adding `ensure ps-hud` to `server.cfg`.

## Architecture

This is a FiveM (GTA V multiplayer) resource with two layers:

**Lua layer** (`client/`, `server/`, `shared/`): Collects game state (health, speed, fuel, etc.), sends it to the UI via `SendNUIMessage`, and receives commands back via `RegisterNUICallback`. Entry point is `client/main.lua`. Server handles permission checks and persists global config to `shared/uiconfig.lua`. The manifest `fxmanifest.lua` declares `ui_page 'html/index.html'` and packages all `html/*` files.

**Svelte UI layer** (`svelte-source/src/`): A Vite + Svelte 3 + TypeScript app that builds into `html/`. It never runs standalone — it only works inside FiveM's NUI browser context where `window.postMessage` carries game events and `fetch('https://ps-hud/<event>')` calls back into Lua.

### NUI message flow

All incoming messages are routed in `utils/eventHandler.ts` → `mainEvent()` via a switch on `event.data.action`. Supported actions: `hudtick`, `car`, `externalstatus`, `menu`, `panel`, `baseplate`, `open`, `show`, `showconstant`, `update`, `updatemoney`, `updateUISettings`, `setLang`. Each action calls a `receive*Message()` method on the appropriate store.

Outgoing calls use `fetchNui(eventName, data)` (POST to `https://ps-hud/<eventName>`). The full event contract is documented in `nui-events.json`.

### Store pattern

Every store is a factory function that:
1. Reads its initial state from `localStorage` (keys: `PSHudMenu`, `PSHudPlayerStatus`, `PSHudLayout`, `PSHudColor`, `PSHudProfile`)
2. Falls back to hard-coded defaults
3. Returns `{ subscribe, set, update, ...domainMethods }`

Stores: `playerStatusHudStore`, `colorEffectStore`, `menuStore`, `layoutStore`, `vehicleHudStore`, `compassHudStore`, `moneyHudStore`, `externalStatusStore`, `profileStore`, `dynamicPanelsStore`, `debugStore`.

### Icon shape system

`src/types/types.ts` defines the entire shape type hierarchy used by every HUD icon:

- `baseIcon` → base props (size, scaling, position, progress)
- `ringIcon extends baseIcon` → adds `ringSize`, `borderGap`, `displayOutline`
- `fillIcon extends baseIcon` → adds `borderSize`
- `roundEndIcon extends baseIcon` → adds `xAxisRound`, `yAxisRound`, `barHeight`
- `notchedIcon extends ringIcon` → adds `dashes`, `gap`
- `pillRingIcon extends ringIcon` → pill-shaped ring

`createShapeIcon(shape, optionalProps)` is the single factory for all 26 shapes — it maps a `shapekind` string to the correct class with default values for that shape. Always use this factory rather than constructing icon classes directly.

Each shape has a corresponding component in `components/hud-shapes/`. These are pure SVG components that receive the shape props and render the visual.

`MetaShape` (`components/meta-shape.svelte`) is the dispatch component: given a `hudIconInfo` object, it renders the correct shape component via a large `{#if}` chain.

### Color effect system

Each icon has a `colorEffects` array (usually 2–3 named stages, e.g. `alive`/`dead` for health) and a `currentEffect` index. `ColorEffectStore.updateIconEffectStage(iconName, stageIndex)` switches the active color stage. `playerStatusHudStore.receiveStatusUpdateMessage()` drives stage transitions (e.g., `armor <= 0` triggers stage 1 on armor).

### Dynamic icon visibility

Icons with `dynamicIcons[name] = true` hide when at their neutral value (health at 100, armor at 0, etc.). The logic lives in `playerStatusHudStore`: `staticGenericHundredHandleShow`, `staticGenericZeroHandleShow`, `staticEngineHandleShow`, `staticNitroHandleShow`.

### Dynamic panels (extension feature)

`dynamicPanelsStore` and `components/dynamic-panels.svelte` allow external FiveM resources to inject panels into the HUD at runtime via `SendNUIMessage({ action: "panel", topic: "add"|"remove"|"update"|"list", ... })`. Each panel can render either a full `MetaShape` (via `hudIconInfo`) or a simple icon+title+value layout.

### Debug mode

`src/stores/debugStore.ts` exports a `boolean`. `scripts/toggleDebug.js` rewrites that file before dev/build runs. When `debugMode = true`, HUD and menu are always visible regardless of game state, and a progress animation cycles automatically.

### Layout presets

`LayoutStore` holds one of 7 `layoutIconKind` values. `meta-layout.svelte` maps each to an absolute-positioned container class. The `standard` layout (bottom-left) includes a `transform: scale(0.7)` override at 1280×720.

### Fuel script compatibility

`client/main.lua` auto-detects whichever fuel script is running (`LegacyFuel`, `ox-fuel`, `nd-fuel`, `frfuel`, `cdn-fuel`, `x-fuel`) and calls the appropriate export, falling back to the native `GetVehicleFuelLevel`.
