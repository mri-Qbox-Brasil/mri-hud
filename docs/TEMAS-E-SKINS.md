# HUD — Temas de Veículo e Skins do Player (em andamento)

Documento de acompanhamento do sistema de **temas/skins selecionáveis** do HUD.
A ideia central: cada visual novo entra como **OPÇÃO** (o admin escolhe), **sem
remover** o visual atual. Origem global no `shared/config.lua`; admins podem
trocar pelo menu do HUD (override por player, salvo em `localStorage`).

> Status geral: **funcional / em iteração**. Defaults globais continuam no visual
> clássico, então nada muda para quem não ativar.

---

## 1. Tema de Veículo — `classic` × `digital`  ✅

Troca o cluster de veículo entre o velocímetro analógico atual (`classic`) e o
**cluster digital/tech ciano** do `design_handoff_car_hud/` (`digital`).

- **Variantes do velocímetro digital:** `ring` (circular) · `arc` (semicircular) ·
  `linear`. Selecionável pelo admin.
- **Sem moldura de minimapa** (usa o radar nativo do jogo).
- Cada peça do cluster digital é um `DraggableHudElement` próprio
  (`digitalCompass`, `digitalSpeedo`, `digitalFuel`, `digitalEngine`,
  `digitalTurbo`, `digitalBelt`, `digitalTach`) → posicionável no F10.
- Bússola legada some quando o digital está ativo dentro do veículo; o ícone
  `harness` (cinto) do status HUD some no digital+veículo (evita duplicar).

### Arquivos
- `shared/config.lua`: `Config.VehicleHudTheme` (`classic`|`digital`),
  `Config.VehicleHudVariant` (`ring`|`arc`|`linear`).
- `client/main.lua`: `sendHudConfig()` envia `vehicleTheme`; loop rápido de
  telemetria envia `rpm/gear/engine/heading`; NUI callback `setVehicleTheme`.
- `web/src/stores/vehicleThemeStore.ts`
- `web/src/components/organisms/VehicleHud.tsx` (branch classic/digital)
- `web/src/components/organisms/VehicleDigitalHud.tsx` (cluster do handoff)
- Menu: seção **Veículo** em `web/src/components/menu/HudPanel.tsx` (admin).

### Notas técnicas
- Velocímetro **arc** e a **bússola** são SVG: o `DraggableHudElement` mede só o
  `<svg>` raiz (pula filhos SVG), então a caixa de limites bate no visível.
  Conic-gradient/overflow:hidden geram caixas gigantes — por isso SVG.

---

## 2. Skin do Player — `classic` × `sobrenatural`  ✅ (com pendências)

Reskin completo da HUD do **player** (vitais + dinheiro + servidor + voz) no
estilo ocultista/Diablo II do `design_handoff_hud_sobrenatural/`. **Não** afeta o
veículo (tema independente) e **não** tem moldura de minimapa.

- **Customização:** 6 paletas (`pergaminho`/`sangue`/`eterno`/`esmeralda`/
  `geada`/`cinzas`) × 4 estilos de vitais (`orbes`/`aneis`/`barras`/`cristal`).
- **Cada peça é um `DraggableHudElement`** (movível separadamente no F10):
  `skinServer`, `skinMoney`, `skinVoice`, e **cada vital** `skinVital_<vida|
  folego|fome|sede|sanidade|mana>`.
- **Toggle `frameless`** — remove os fundos de pedra das **orbes** e do
  **dinheiro** (ficam só as orbes / só os valores). O painel do **servidor**
  mantém o fundo sempre.

### Mapa de dados (vitais 0–100)
| vital     | fonte                                   |
|-----------|------------------------------------------|
| vida      | `health` (HUD base)                      |
| fome      | `hunger` (HUD base)                      |
| sede      | `thirst` (HUD base)                     |
| fôlego    | **custom** — `supernaturalVitalsStore`   |
| sanidade  | **custom** — `supernaturalVitalsStore`   |
| mana      | **custom** — `supernaturalVitalsStore`   |

Os 3 custom são alimentados por outro resource via NUI:
```lua
SendNUIMessage({ action = 'vitals', topic = 'supernatural',
                 folego = 80, sanidade = 60, mana = 45 })
```
Default 100 até um script setar.

### Arquivos
- `shared/config.lua`: `Config.PlayerHudSkin` (`classic`|`sobrenatural`),
  `Config.SupernaturalPalette`, `Config.SupernaturalStyle`,
  `Config.SupernaturalFrameless`. (`Config.SupernaturalLayout` existe mas não é
  usado no render — ver pendências.)
- `client/main.lua`: `sendHudConfig()` envia `playerSkin`; NUI callback
  `setPlayerSkin`.
- `web/src/stores/playerSkinStore.ts` (skin/palette/style/frameless)
- `web/src/stores/supernaturalVitalsStore.ts` (folego/sanidade/mana)
- `web/src/components/organisms/SupernaturalHud.tsx` (**kit** de peças: `SKINS`,
  `VitalPanel`, `ServerPanel`, `MoneyPanel`, `VoicePanel`, `ClockPanel`, helpers,
  `KEYFRAMES`)
- `web/src/components/organisms/SupernaturalSkin.tsx` (container: compõe as peças
  como `DraggableHudElement` e mapeia os stores)
- `web/src/App.tsx`: quando `skin === 'sobrenatural'`, oculta `MetaLayout`,
  `MoneyHud`, `ServerLogoHud` e renderiza `SupernaturalSkin` (veículo/bússola
  seguem normais).
- Menu: seção **Skin do HUD do Player** em `HudPanel.tsx` (admin).
- Fontes: Cinzel / Cinzel Decorative / JetBrains Mono (`web/src/index.css`).

---

## 3. Pendências (continuar depois)

1. **Painel do servidor** (`skinServer`): hoje usa defaults (`MRI`/`roleplay`),
   `players`/`ping` ficam ocultos por falta de dado. Definir fonte: convar,
   callback do server, ou config estático.
2. **Relógio** (`ClockPanel`): peça existe no kit mas **não é renderizada** (sem
   fonte de hora in-game). Ligar a um script de tempo do servidor se quiser.
3. **Vitais custom** (fôlego/sanidade/mana): definir **quem alimenta** (resource
   próprio via a action `vitals/supernatural`) ou mapear provisoriamente para
   `oxygen`/`stress`/`armor`.
4. **Âncoras padrão** das peças do skin são um primeiro corte — ajustar os
   defaults conforme o posicionamento desejado (ou deixar o usuário posicionar
   no F10; as posições persistem).
5. **`Config.SupernaturalLayout`** (`unido`/`separado`/`classico`) ficou no
   store/config mas **sem efeito** no render (posicionamento agora é manual por
   peça). Decidir: remover de vez ou repropor como preset de âncoras.
6. **Broadcast runtime global**: hoje a troca do admin é override **por player**
   (localStorage). Se quiser que a escolha do admin afete **todos em tempo real**
   (como o accent `mri:color`), adicionar um broadcast server→clients.
7. **Posicionamento por peça no skin**: já funciona; falta validar/tunar os ids
   no sistema de `positioning` (permissões canMove/canResize por elemento, se for
   o caso).

---

## 4. Como testar (dev)

- `cd web && pnpm dev` (ou o servidor Vite já rodando na 5173). O `dev` liga
  `debugMode=true`; os `debugMocks.ts` já ativam o tema **digital** de veículo e o
  skin **sobrenatural** com valores de exemplo para visualização.
- Trocar tema/skin/paleta/estilo/frameless no menu do HUD (em debug o menu abre
  sozinho; os seletores exigem `isAdmin`, que é `true` em debug).
- F10 entra no modo de posicionamento para mover/esconder/redimensionar cada
  peça.
- **Build de produção:** `cd web && pnpm build` (gera `html/` com `debugMode=false`).
  Os defaults globais permanecem no visual clássico.
