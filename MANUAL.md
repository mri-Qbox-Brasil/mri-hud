# Manual — MRI HUD (ps-hud)

Manual completo do recurso **MRI HUD** para incorporação à documentação da MRI. Cobre instalação, configuração, uso in-game, temas/skins, o sistema de vitais custom e a **API de extensão** (eventos e exports) para integrar outros scripts.

> **Nome do resource:** nos exemplos o recurso se chama **`ps-hud`** (nome padrão — não deve ser renomeado). Em `exports['ps-hud']:...` e nos eventos, use o nome real da pasta caso seja diferente no seu servidor.

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Instalação e dependências](#2-instalação-e-dependências)
3. [Configuração](#3-configuração)
4. [Uso in-game](#4-uso-in-game)
5. [Temas e skins](#5-temas-e-skins)
6. [Sistema de vitais custom](#6-sistema-de-vitais-custom)
7. [API de extensão para outros resources](#7-api-de-extensão-para-outros-resources)
8. [Referência de eventos NUI](#8-referência-de-eventos-nui)
9. [Integração de estresse](#9-integração-de-estresse)
10. [Desenvolvimento do front-end](#10-desenvolvimento-do-front-end)
11. [Solução de problemas](#11-solução-de-problemas)

---

## 1. Visão geral

O MRI HUD é composto por:

- **Front-end (NUI):** aplicação React + Vite + TypeScript em `web/`, compilada para `html/` e carregada como `ui_page`. Estado gerenciado por stores Zustand.
- **Back-end (Lua):** `client/` (coleta dados do jogo e envia à NUI), `server/` (permissões, config global, vitais persistidos) e `shared/` (config).

### Fluxo de dados

- **Lua → NUI:** `SendNUIMessage({ action, topic, ... })`. A NUI escuta em `utils/eventHandler.ts` e roteia por `action`/`topic` para o store correspondente.
- **NUI → Lua:** `fetchNui(evento, dados)` → `RegisterNUICallback(evento, ...)`.
- **Outros resources → HUD:** via **exports** do `ps-hud` (que rodam no contexto do recurso e disparam o `SendNUIMessage`) ou via **eventos** `TriggerClientEvent('hud:client:...')`.

Arquitetura técnica detalhada: ver `ARCHITECTURE.md`. Contrato de eventos: `nui-events.json`.

---

## 2. Instalação e dependências

### Dependências

| Recurso | Obrigatório | Uso |
|---|---|---|
| qb-core / QBox | Sim | Framework, dados do jogador, metadata |
| ox_lib | Sim | Locales (i18n) |
| oxmysql | Sim | Config global persistida no banco |
| ps-buffs | Não | Buffs/enhancements opcionais |

### Passos

1. Copie a pasta `ps-hud` para `resources/`.
2. No `server.cfg`: `ensure ps-hud`.
3. Reinicie o servidor.

> Ordem dos scripts server (definida no `fxmanifest.lua`): `oxmysql` → `db.lua` → `main.lua` → `vitals.lua` → `settings.lua`.

---

## 3. Configuração

Os **defaults** ficam em `shared/config.lua`. Quando `Config.AdminOnly = true`, o servidor pode **persistir a config global no banco** (gravada pelo menu in-game / plugin do mri_Qadmin) e impô-la a todos.

### 3.1 Geral

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `Config.OpenMenu` | string | `'I'` | Tecla que abre o menu de configurações |
| `Config.PositioningKey` | string | `'F10'` | Tecla do modo de posicionamento |
| `Config.AdminOnly` | boolean | `false` | `true` = só admin edita e as configs valem pra todos |
| `Config.UseMPH` | boolean | `true` | Velocidade em MPH (`false` = KM/H) |
| `Config.VehicleEnabled` | boolean | `true` | Liga/desliga a parte de veículo da HUD |
| `Config.EngineCommand` | boolean | `false` | Liga o comando embutido de motor (`+engine`, tecla G) |

### 3.2 Estresse

| Campo | Padrão | Descrição |
|---|---|---|
| `Config.StressChance` | `0.1` | Chance de estresse ao atirar (0–1) |
| `Config.MinimumStress` | `50` | Nível mínimo para tremer a tela |
| `Config.MinimumSpeed` | `100` | Velocidade que gera estresse (com cinto) |
| `Config.MinimumSpeedUnbuckled` | `50` | Velocidade que gera estresse (sem cinto) |
| `Config.DisablePoliceStress` | `false` | Desativa estresse para o job `police` |
| `Config.VehClassStress` | tabela | Liga/desliga estresse por classe de veículo |
| `Config.Intensity` / `Config.EffectInterval` | tabelas | Curvas de blur/timeout por faixa de estresse |
| `Config.WhitelistedWeaponArmed` / `WhitelistedWeaponStress` | tabelas | Armas que não acionam modo armado/estresse |

### 3.3 Tema de veículo

| Campo | Valores | Padrão |
|---|---|---|
| `Config.VehicleHudTheme` | `'classic'` \| `'digital'` | `'classic'` |
| `Config.VehicleHudVariant` | `'ring'` \| `'arc'` \| `'linear'` | `'ring'` |

### 3.4 Skin de player (sobrenatural)

| Campo | Valores | Padrão |
|---|---|---|
| `Config.PlayerHudSkin` | `'classic'` \| `'sobrenatural'` | `'classic'` |
| `Config.SupernaturalPalette` | `pergaminho` \| `sangue` \| `eterno` \| `esmeralda` \| `geada` \| `cinzas` | `'pergaminho'` |
| `Config.SupernaturalStyle` | `orbes` \| `aneis` \| `barras` \| `cristal` \| `calice` | `'orbes'` |
| `Config.SupernaturalFrameless` | boolean | `false` |

### 3.5 Vitais custom (mana / sanidade)

```lua
Config.SupernaturalVitals = {
    enabled       = true,   -- liga o sistema server-side (regen + sync)
    regenInterval = 5000,   -- ms entre cada tick de regen
    mana     = { default = 100, max = 100, regen = 2 }, -- regen = pontos por tick (0 = sem regen)
    sanidade = { default = 100, max = 100, regen = 1 },
}
```

### 3.6 Ícones de status

Define quais ícones aparecem e em que ordem. Remova a entrada ou use `enabled = false` para ocultar:

```lua
Config.StatusIcons = {
    { id = "voice",  enabled = true },
    { id = "health", enabled = true },
    { id = "armor",  enabled = true },
    { id = "hunger", enabled = true },
    -- thirst, stress, oxygen, armed, parachute, harness, cruise, nitro, dev ...
}
```

### 3.7 Logo do servidor

```lua
Config.ServerLogo = {
    enabled = true,
    src     = "https://.../logo96.webp",  -- URL ou arquivo em html/
    width   = 80,   -- px
    x       = 50,   -- posição horizontal (vw %)
    y       = 5,    -- posição vertical (vh %)
}
```

### 3.8 Modo de posicionamento

Controla o que pode ser reposicionado no F10 (por elemento: `canMove`, `canHide`, `canResize`):

```lua
Config.Positioning = {
    enabled = true,
    elements = {
        statusBar   = { canMove = true, canHide = true,  canResize = false },
        speedometer = { canMove = true, canHide = true,  canResize = true  },
        -- compassHud, moneyHud, minimap, fuelgauge, seatbelt, serverLogo,
        -- aircraftFuel, dynamicGauges ...
    },
}
```

> Elementos custom (orbs, digital, etc.) não precisam ser listados aqui — recebem permissões padrão (todas liberadas).

---

## 4. Uso in-game

| Ação | Padrão |
|---|---|
| Abrir/fechar menu de configurações | tecla **I** |
| Modo de posicionamento (arrastar/ocultar/redimensionar) | tecla **F10** (ESC sai) |
| Ver saldo em dinheiro | `/cash` |
| Ver saldo no banco | `/bank` |
| Alternar dev mode | `/dev` (admin) |

**Menu** (abas): **Preferências** (reset, opções, notificações, status, veículo, bússola, cinemático), **Aparência** (formas, tamanho, cor, layout, temas/skins) e **Ícones** (habilitar/ordenar — admin).

**Modo de posicionamento:** cada peça vira arrastável, com linhas-guia de alinhamento (ímã ao centro da tela e às bordas de outros elementos), botões de ocultar e de escala, e reset de posição.

---

## 5. Temas e skins

Temas/skins são **opções** (o admin escolhe) — nunca removem o visual atual. O default vem do config/banco; admins trocam pelo menu.

### 5.1 Veículo

- **`classic`** — velocímetro analógico (gauges do ui-kit).
- **`digital`** — cluster tech: velocímetro (`ring`/`arc`/`linear`), barras de combustível/motor, turbo, RPM/marcha, cinto e bússola. Cada peça é reposicionável no F10.

### 5.2 Player

- **`classic`** — HUD de ícones de status atual.
- **`sobrenatural`** — reskin ocultista (Diablo II). Vitais renderizados como **orbes / anéis / barras / cristal / cálice**, em 6 paletas. Reskina vitais, dinheiro e voz; não afeta o veículo. Cada peça é reposicionável.

**Mapa de vitais na skin sobrenatural:**

| Vital | Fonte |
|---|---|
| Vida | `health` (HUD base) |
| Fome | `hunger` (HUD base) |
| Sede | `thirst` (HUD base) |
| Fôlego | stamina de sprint (client) |
| Mana | stat custom persistido (server) |
| Sanidade | stat custom persistido (server) |

---

## 6. Sistema de vitais custom

Três vitais além de vida/fome/sede:

- **Fôlego** — reflete a stamina de sprint (`GetPlayerSprintStaminaRemaining`). Client-side, sem persistência, atualizado automaticamente.
- **Mana** e **Sanidade** — **persistidos** em metadata QBCore (por personagem), **server-autoritativos**, com **regen automático** (`Config.SupernaturalVitals`). Sincronizados ao cliente via statebag, exatamente como fome/sede/stress.

Definidos no servidor por `server/vitals.lua`. O regen só grava enquanto o valor está abaixo do máximo (silencia quando cheio).

### 6.1 Export único (server-side)

```lua
exports['ps-hud']:AdjustVital(src, attribute, value, mode)
```

| Parâmetro | Descrição |
|---|---|
| `src` | server id do jogador |
| `attribute` | `'mana'` ou `'sanidade'` |
| `value` | magnitude (≥ 0); em `'set'` é o valor absoluto |
| `mode` | `'add'` (aumenta) \| `'remove'` (reduz) \| `'set'` (crava). Padrão `'add'` |

Retorna o **novo valor** (0..max), já com clamp, sync e persistência — dispensando um getter na maioria dos casos.

```lua
-- Exemplos
exports['ps-hud']:AdjustVital(src, 'mana', 25, 'remove')   -- lançar magia gasta 25
exports['ps-hud']:AdjustVital(src, 'sanidade', 10, 'add')  -- recupera 10
exports['ps-hud']:AdjustVital(src, 'mana', 100, 'set')     -- crava em 100
local mana = exports['ps-hud']:AdjustVital(src, 'mana', 0, 'add') -- só lê o atual
```

> **Fôlego** não tem export — é derivado da stamina automaticamente.

---

## 7. API de extensão para outros resources

Três mecanismos para injetar elementos na HUD. Todos seguem o mesmo padrão: um **export** (que roda no contexto do `ps-hud`) ou um **evento** equivalente. Cada elemento tem um `id` único e é **reposicionável/ocultável/redimensionável** no F10.

### 7.1 Painéis dinâmicos

Ícone + título + valor (ou uma shape completa via `hudIconInfo`).

```lua
exports['ps-hud']:AddHudPanel({
    id = 'radiacao', title = 'Radiação', icon = 'radiation', value = '42%', isShowing = true,
})
exports['ps-hud']:UpdateHudPanel('radiacao', { value = '61%' })
exports['ps-hud']:RemoveHudPanel('radiacao')
```

Eventos equivalentes: `hud:client:AddPanel(panel)`, `hud:client:UpdatePanel(id, patch)`, `hud:client:RemovePanel(id)`.

### 7.2 Custom orbs (skin sobrenatural)

Orbe com **cor (hex), glifo e label livres**. Aparecem sempre (independem do skin ativo).

```lua
exports['ps-hud']:SetHudOrb({
    id = 'corrupcao',   -- obrigatório
    label = 'Corrupção',
    glyph = 'ᛟ',        -- runa/letra/emoji no centro
    color = '#c75b4a',  -- hex; alimenta o líquido e o brilho
    value = 66,         -- 0..maxValue
    size = 72,          -- px (≥70 = orbe grande)
    maxValue = 100,
    lowAt = 25,         -- pulsa alerta quando value ≤ lowAt (0 = nunca)
    left = 480, bottom = 300,  -- âncora default (px); usuário reposiciona no F10
})
exports['ps-hud']:UpdateHudOrbValue('corrupcao', 40)  -- só o valor (barato)
exports['ps-hud']:RemoveHudOrb('corrupcao')
```

Só o `id` é obrigatório; o resto cai em defaults. Eventos: `hud:client:SetOrb(orb)`, `hud:client:UpdateOrbValue(id, value)`, `hud:client:RemoveOrb(id)`.

### 7.3 Elementos no cluster digital do veículo

Peças que encaixam no tema **digital** do veículo (só aparecem quando o tema digital está ativo e o cluster visível).

```lua
exports['ps-hud']:SetDigitalElement({
    id = 'nos',         -- obrigatório
    kind = 'bar',       -- 'bar' | 'pill' | 'text'
    label = 'NOS',
    value = 80,         -- bar: 0..100 · pill: aceso se >0 · text: número exibido
    text = '',          -- pill/text: texto (sobrepõe o número)
    color = '#a87fe0',  -- hex; "" = usa o accent do tema
    glow = true,
    left = 'calc(50% + 220px)', bottom = 108,  -- âncora default no cluster
})
exports['ps-hud']:UpdateDigitalElementValue('nos', 40)
exports['ps-hud']:RemoveDigitalElement('nos')
```

**Tipos (`kind`):**

| kind | Visual | Campo principal |
|---|---|---|
| `bar` | barra vertical (igual FUEL/ENG/TURBO) | `value` 0..100 |
| `pill` | pílula com ponto (igual BELT) | `text`, aceso se `value` > 0 |
| `text` | número grande + label (igual GEAR/RPM) | `value` / `text` |

Eventos: `hud:client:SetDigitalElement(el)`, `hud:client:UpdateDigitalElementValue(id, value)`, `hud:client:RemoveDigitalElement(id)`.

### 7.4 Exemplo de integração completa (magia + orbe de mana + NOS)

```lua
-- server: consome mana ao lançar magia
RegisterNetEvent('meuscript:castSpell', function()
    local src = source
    local mana = exports['ps-hud']:AdjustVital(src, 'mana', 20, 'remove')
    if mana <= 0 then
        TriggerClientEvent('QBCore:Notify', src, 'Mana insuficiente', 'error')
    end
end)

-- client: mostra uma orbe custom de "energia" e atualiza o valor
exports['ps-hud']:SetHudOrb({ id = 'energia', label = 'Energia', glyph = 'ᛉ', color = '#5fb87a', value = 100 })
CreateThread(function()
    while true do
        Wait(1000)
        exports['ps-hud']:UpdateHudOrbValue('energia', GetEnergiaAtual())
    end
end)
```

---

## 8. Referência de eventos NUI

Contrato completo em `nui-events.json`. Principais mensagens **Lua → NUI** (`SendNUIMessage`):

| action | topics | Uso |
|---|---|---|
| `hudtick` | `display`, `status` | Status do jogador (vida, armor, fome, sede, stress, voz, oxigênio…) |
| `car` | `display`, `status`, `speed` | HUD de veículo |
| `vitals` | `supernatural` | Vitais custom da skin (`folego`, `mana`, `sanidade`) |
| `panel` | `add`, `remove`, `update`, `list` | Painéis dinâmicos |
| `orb` | `set`, `value`, `remove`, `list`, `clear` | Custom orbs |
| `digitalelement` | `set`, `value`, `remove`, `list`, `clear` | Elementos custom do cluster digital |
| `gauge` | `set`, `value`, `remove`, `show`, `list`, `clear` | Gauges dinâmicos |
| `updatemoney` / `show` / `showconstant` | — | Dinheiro |
| `baseplate` / `update` | compass | Bússola |
| `hudconfig` | — | Config global (icons, serverLogo, positioning, temas, skin) |
| `setLocales` | — | Dicionário de tradução (ox_lib) |

> `orb` e `digitalelement` são normalmente disparados pelos exports da [seção 7](#7-api-de-extensão-para-outros-resources) — não é preciso montar o `SendNUIMessage` na mão.

---

## 9. Integração de estresse

O HUD já expõe eventos de servidor para outros scripts ajustarem estresse (persistido em metadata):

```lua
TriggerServerEvent('hud:server:GainStress', amount)     -- ganha estresse
TriggerServerEvent('hud:server:RelieveStress', amount)  -- alivia estresse
```

O cliente também escuta `hud:client:UpdateStress(valor)` e o statebag `stress`.

---

## 10. Desenvolvimento do front-end

O front fica em `web/` (React + Vite + TypeScript). Stores Zustand em `web/src/stores/`, componentes em `web/src/components/`.

### Build

```bash
cd web
pnpm install
pnpm build      # gera html/ (carregado pelo FiveM) e seta debugMode=false
```

### Preview no navegador (sem FiveM)

```bash
cd web
node ./scripts/toggleDebug.js true   # ativa debugMode (HUD sempre visível + mocks)
pnpm dev                             # dev server em http://localhost:5173
```

Com `debugMode = true`, a HUD e o menu ficam sempre visíveis e valores animam automaticamente. Mocks de preview (incluindo uma orbe custom e um elemento digital) ficam em `web/src/debugMocks.ts`.

> Alterações apenas em **Lua/config/json** não precisam de build — basta reiniciar o resource. Alterações no **web** exigem `pnpm build`.

### Compatibilidade CEF (importante)

O Chromium do FiveM é antigo: **não** suporte `oklch()` nem `color-mix`. Use `rgb`/`rgba`/`hsl`/hex em qualquer estilo da HUD. `conic-gradient` é suportado.

---

## 11. Solução de problemas

| Sintoma | Causa provável / solução |
|---|---|
| Minimapa pisca com mapa custom | `ensure ps-hud` **antes** do recurso de mapa no `server.cfg` |
| Exports não funcionam | Confira o nome do resource em `exports['ps-hud']` (use o nome real da pasta) |
| Mana/sanidade travadas em 100 | `Config.SupernaturalVitals.enabled` deve ser `true`; verifique se `server/vitals.lua` carregou |
| Orbe custom não aparece | Envie ao menos `id`; confira se o valor foi setado; orbes aparecem em qualquer skin |
| Elemento digital não aparece | Só aparece com o tema de veículo **digital** ativo e dentro de um veículo |
| Menu com cantos pretos / borda estranha | Efeito antigo do CEF já corrigido no `Menu.tsx` (máscara alpha); rebuild do web |
| Cores inválidas in-game | Não use `oklch`/`color-mix` (ver seção 10) |
| Locales não traduzem | `ox_lib` atualizado e `qb_locale` setado no `server.cfg` |

---

*Mantido pela MRI Qbox Brasil. Base original: Project Sloth (ps-hud).*
