# MRI HUD

HUD ultra-customizável para **FiveM (QBox / QBCore)** com menu de configurações in-game, temas/skins selecionáveis, vitais persistidos e uma API de extensão para outros resources injetarem seus próprios elementos.

Front-end em **React + Vite + TypeScript** (compilado para NUI); back-end em **Lua**. Fork mantido pela **MRI Qbox Brasil** — originalmente [ps-hud](https://www.discord.gg/projectsloth) da Project Sloth, com a NUI migrada de Svelte para React.

> 📖 **Documentação completa:** veja [MANUAL.md](MANUAL.md) — referência de configuração, temas, vitais e a API de extensão (eventos/exports) para integrar outros scripts.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Dependências](#dependências)
- [Instalação](#instalação)
- [Configuração rápida](#configuração-rápida)
- [Uso in-game](#uso-in-game)
- [Temas e skins](#temas-e-skins)
- [Vitais custom (mana / sanidade / fôlego)](#vitais-custom-mana--sanidade--fôlego)
- [API de extensão](#api-de-extensão)
- [Desenvolvimento](#desenvolvimento)
- [Avisos importantes](#avisos-importantes)
- [Créditos](#créditos)

---

## Funcionalidades

- **Ícones de status** com formas, tamanho, posição e cor configuráveis individualmente (26 shapes)
- **Menu in-game** (padrão ui-kit) em abas: Preferências, Aparência e Ícones, com preview em tempo real
- **Modo de posicionamento** (F10): arraste/oculte/redimensione cada peça da HUD com ímã de alinhamento
- **Temas de veículo**: clássico (analógico) ou **digital** (cluster tech com velocímetro ring/arc/linear, RPM, turbo, bússola)
- **Skins de player**: clássico ou **sobrenatural** (orbes/anéis/barras/cristal/cálice, 6 paletas ocultistas)
- **Vitais custom** persistidos: **mana** e **sanidade** (metadata QBCore + regen automático) e **fôlego** (stamina)
- **Sistemas de extensão** para outros resources: painéis dinâmicos, **custom orbs** e **elementos custom no cluster digital**
- **Config por jogador** (padrão) ou **centralizada pelo admin** (global, persistida no banco via plugin do mri_Qadmin)
- **i18n** via `ox_lib` (locales em `locales/*.json`)
- Compatível com [ps-buffs](https://github.com/Project-Sloth/ps-buffs) (opcional)

---

## Dependências

| Recurso | Obrigatório |
|---|---|
| [qb-core](https://github.com/qbcore-framework/qb-core) / QBox | Sim |
| [ox_lib](https://github.com/overextended/ox_lib) | Sim (locales) |
| [oxmysql](https://github.com/overextended/oxmysql) | Sim (config global no banco) |
| [ps-buffs](https://github.com/Project-Sloth/ps-buffs) | Não (opcional) |

---

## Instalação

1. Arraste a pasta `ps-hud` para `resources/`
2. Adicione ao `server.cfg`:

```cfg
ensure ps-hud
```

3. Reinicie o servidor.

> Se usar mapas customizados com `SetRadarZoom()`, coloque `ensure ps-hud` **antes** do recurso de mapa para evitar que o minimapa pisque.

---

## Configuração rápida

Os defaults ficam em `shared/config.lua`. Os campos mais usados:

| Campo | Padrão | Descrição |
|---|---|---|
| `Config.AdminOnly` | `false` | `true` = só admin abre o menu e as configs valem pra todos |
| `Config.UseMPH` | `true` | Velocidade em MPH (`false` = KM/H) |
| `Config.VehicleHudTheme` | `'classic'` | `'classic'` ou `'digital'` |
| `Config.PlayerHudSkin` | `'classic'` | `'classic'` ou `'sobrenatural'` |
| `Config.SupernaturalVitals` | tabela | Liga/regen de mana e sanidade |

A referência completa (todos os campos, StatusIcons, ServerLogo, Positioning, temas, vitais) está no [MANUAL.md](MANUAL.md#configuração).

---

## Uso in-game

| Ação | Padrão |
|---|---|
| Abrir menu de configurações | tecla **I** (`Config.OpenMenu`) |
| Modo de posicionamento | tecla **F10** (`Config.PositioningKey`) |
| Ver saldo em dinheiro | `/cash` |
| Ver saldo no banco | `/bank` |
| Alternar dev mode (admin) | `/dev` |

---

## Temas e skins

- **Veículo** — `classic` (velocímetro analógico) ou `digital` (cluster tech). No digital, o velocímetro tem 3 variantes: `ring`, `arc`, `linear`.
- **Player** — `classic` (HUD atual) ou `sobrenatural` (reskin ocultista). A skin sobrenatural tem 6 paletas (`pergaminho`, `sangue`, `eterno`, `esmeralda`, `geada`, `cinzas`) e 5 estilos de vital (`orbes`, `aneis`, `barras`, `cristal`, `calice`).

Admins podem trocar tema/skin pelo menu in-game; o default vem do config/banco. Detalhes no [MANUAL.md](MANUAL.md#temas-e-skins).

---

## Vitais custom (mana / sanidade / fôlego)

Além de vida/fome/sede, a skin sobrenatural expõe três vitais extras:

- **Fôlego** = stamina de sprint (automático, client-side).
- **Mana** e **Sanidade** = stats **persistidos** em metadata QBCore (por personagem), server-autoritativos, com **regen automático** configurável.

Outros scripts alteram mana/sanidade com **um único export** (server-side):

```lua
exports['ps-hud']:AdjustVital(src, 'mana', 25, 'remove')   -- gasta 25 de mana
exports['ps-hud']:AdjustVital(src, 'sanidade', 10, 'add')  -- recupera 10 de sanidade
exports['ps-hud']:AdjustVital(src, 'mana', 100, 'set')     -- crava valor absoluto
```

Veja [MANUAL.md](MANUAL.md#sistema-de-vitais-custom).

---

## API de extensão

Outros resources podem injetar elementos na HUD (rodando dentro do contexto do `ps-hud` via export):

```lua
-- Painel dinâmico (ícone + valor)
exports['ps-hud']:AddHudPanel({ id = 'radiacao', title = 'Radiação', icon = 'radiation', value = '42%' })

-- Orbe custom (skin sobrenatural)
exports['ps-hud']:SetHudOrb({ id = 'corrupcao', label = 'Corrupção', glyph = 'ᛟ', color = '#c75b4a', value = 66 })

-- Elemento no cluster digital do veículo
exports['ps-hud']:SetDigitalElement({ id = 'nos', kind = 'bar', label = 'NOS', value = 80, color = '#a87fe0', glow = true })
```

Contrato completo (todos os tópicos, campos e eventos) em [MANUAL.md](MANUAL.md#api-de-extensão-para-outros-resources).

---

## Desenvolvimento

O front-end fica em `web/` (React + Vite). Para compilar a NUI:

```bash
cd web
pnpm install
pnpm build      # gera html/ (o que o FiveM carrega) e seta debugMode=false
```

Para preview no navegador (dev server, sem FiveM), veja a seção de desenvolvimento no [MANUAL.md](MANUAL.md#desenvolvimento-do-front-end).

---

## Avisos importantes

- **Não renomeie o recurso** de `ps-hud` — quebra referências internas e os exemplos de export/evento.
- Mantenha `qb-core` e `ox_lib` atualizados (locales).
- Se o minimapa pisca com mapas customizados, coloque `ensure ps-hud` antes do recurso de mapa.

---

## Créditos

- Base original: **Project Sloth** ([ps-hud](https://github.com/Project-Sloth/ps-hud)).
- Fork, migração React, temas/skins, vitais e API de extensão: **MRI Qbox Brasil**.
- Port não suportado para ESX: [reyyghi/ps-hud](https://github.com/reyyghi/ps-hud).

Copyright © 2022 Project Sloth. Manutenção e evolução: MRI Qbox Brasil.
