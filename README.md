# PS HUD

HUD ultra-customizável para FiveM (QBCore) com menu de configurações completo. Permite alterar ícones, posição, tamanho, cor, forma e comportamento de todos os elementos diretamente in-game, com suporte a configuração por jogador ou centralizada pelo admin.

Desenvolvido por [Project Sloth](https://www.discord.gg/projectsloth). Código-fonte Svelte disponível em [svelte-source](https://github.com/Project-Sloth/ps-hud/tree/main/svelte-source).

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Dependências](#dependências)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Avisos Importantes](#avisos-importantes)
- [Créditos](#créditos)

---

## Funcionalidades

- Formas de ícone personalizáveis
- Ajuste de tamanho, posição e cor de cada ícone individualmente
- Opções infinitas de layout e espaçamento
- Menu de configurações in-game com preview em tempo real
- Configuração por jogador (padrão) ou centralizada pelo admin
- Suporte a locales (idioma via `qb-core`)
- Compatível com [ps-buffs](https://github.com/Project-Sloth/ps-buffs) (opcional)

---

## Dependências

| Recurso | Obrigatório |
|---|---|
| [qb-core](https://github.com/qbcore-framework/qb-core) | Sim |
| [ps-buffs](https://github.com/Project-Sloth/ps-buffs) | Não (opcional) |

---

## Instalação

1. Arraste a pasta `ps-hud` para `resources/`
2. Adicione ao `server.cfg`:

```cfg
ensure ps-hud
```

3. Reinicie o servidor

> Se estiver usando mapas customizados que usam `SetRadarZoom()`, adicione `ensure ps-hud` **antes** do recurso de mapa para evitar que o minimapa pulse ou pisque.

---

## Configuração

Edite `ps-hud/config.lua`:

| Campo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `Config.AdminOnly` | `boolean` | `false` | Se `true`, apenas admins acessam as configurações e as mudanças se aplicam a todos os jogadores do servidor |
| `Config.UseMPH` | `boolean` | `false` | Exibe velocidade em MPH em vez de KM/H |
| `Config.StressChance` | `number` | — | Chance de ganho de estresse por ações |

### Modo Admin (`Config.AdminOnly = true`)

Quando ativado:
- O menu de configurações fica inacessível para jogadores comuns
- Qualquer configuração salva pelo admin é aplicada globalmente a todos os jogadores
- Ideal para servidores que querem aparência uniforme do HUD

### Modo jogador (`Config.AdminOnly = false`)

Cada jogador pode personalizar seu próprio HUD via menu in-game, sem afetar os demais.

---

## Avisos Importantes

- **Não renomeie este recurso** de `ps-hud` — causará problemas de referência interna
- Mantenha o `qb-core` atualizado para suporte a locales
- Se o minimapa pulsa ou pisca com mapas customizados, adicione `ensure ps-hud` antes do recurso de mapa no `server.cfg`

---

## Créditos

- Inspiração e trechos de código de [Svelte & Lua Boilerplate](https://github.com/project-error/svelte-lua-boilerplate) by [Project Error](https://github.com/project-error)
- Versão não suportada para ESX: [reyyghi/ps-hud](https://github.com/reyyghi/ps-hud)

Copyright © 2022 Project Sloth.
