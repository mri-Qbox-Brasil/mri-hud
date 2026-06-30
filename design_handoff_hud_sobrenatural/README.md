# Handoff: HUD Sobrenatural (FiveM · tema ocultista / Diablo II)

## Visão geral
HUD de jogo para um servidor de FiveM com pegada ocultista/rústica ("Diablo II"):
orbes de líquido para Vida e Mana, mini-orbes para os status secundários,
painéis de pedra com cantos dourados, minimapa, dinheiro, relógio in-game e
indicador de voz. Tudo nos cantos da tela (HUD clássica).

O objetivo deste pacote é **adicionar este visual como uma segunda "skin" do HUD
que já existe no seu projeto** (React + Tailwind + shadcn) — não substituir o atual.

## Sobre os arquivos
- `SupernaturalHud.tsx` — **componente React drop-in já pronto** (TypeScript, Tailwind
  + estilos inline para os valores contínuos). É o ponto de partida real; cole no
  projeto e ligue aos seus dados.
- `HUD Sobrenatural.dc.html` — **referência de design** (protótipo em HTML). Serve só
  para conferir o visual/comportamento pretendido e tem 6 paletas × 4 estilos ×
  3 disposições selecionáveis no topo. **Não é para portar este HTML** — use o `.tsx`.

## Fidelidade
**Alta fidelidade.** Cores, tipografia, sombras e medidas são finais. O `.tsx`
reproduz o protótipo fielmente. Ajuste só o necessário para casar com a arquitetura
do seu HUD (origem dos dados, store, NUI callbacks do FiveM).

## Integração (React + Tailwind + shadcn)

1. **Copie** `SupernaturalHud.tsx` para os seus componentes (ex.: `src/components/hud/`).

2. **Fontes** — o visual depende de três famílias. Adicione uma vez no app:
   ```html
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
   ```
   (ou `@fontsource/cinzel`, `@fontsource/cinzel-decorative`, `@fontsource/jetbrains-mono`).

3. **Renderize** passando os dados do seu HUD (todos os vitais em 0–100):
   ```tsx
   <SupernaturalHud
     vitals={{ vida: hp, folego: stamina, fome, sede, sanidade, mana }}
     money={{ cash, bank }}
     server={{ name, tagline, sigil, players, ping }}
     clock={{ time, date }}
     voice={{ talking, range }}
     minimap={{ street, district }}
     skin="pergaminho"   // pergaminho | sangue | eterno | esmeralda | geada | cinzas
     style="orbes"       // orbes | aneis | barras | cristal
     layout="classico"   // unido | separado | classico
   />
   ```

4. **Skin selecionável** — exponha `skin/style/layout` como prop/estado do seu seletor
   de tema. Para "segunda opção do HUD", basta trocar o componente renderizado conforme
   a skin ativa do usuário.

5. **Minimapa** — o protótipo desenha um minimapa fake. No FiveM o minimapa nativo é
   renderizado pelo jogo: troque o bloco do minimapa por um container vazio posicionado
   sobre o minimapa do jogo (mantendo a moldura de pedra), ou remova-o.

6. **Fundo placeholder** — o `.tsx` desenha um fundo "gameplay" só para visualização.
   No jogo **remova** os 3 primeiros `<div>` de fundo + as brasas (comentados no arquivo)
   para a HUD ficar transparente sobre o jogo. As brasas são decorativas; mantenha se quiser.

7. **Voz** — as barrinhas usam `Date.now()` para animar; se quiser reatividade real,
   ligue à amplitude do mic. `voice.talking` controla o anel pulsante.

## Props (contrato)
- `vitals: { vida, folego, fome, sede, sanidade, mana }` — **números 0–100** (obrigatório).
- `money?: { cash: string; bank: string }` — strings já formatadas (ex.: `'12.480'`).
- `server?: { name, tagline, sigil, players, ping }`.
- `clock?: { time, date }` — strings (ex.: `'03:33'`, `'III · Lua Negra'`).
- `voice?: { talking: boolean; range: string }`.
- `minimap?: { street, district }`.
- `skin?`, `style?`, `layout?` — ver acima. `className?` passa por no wrapper raiz.

## Estilos dos vitais
- **orbes** — Vida e Mana em orbes grandes (96px) + 4 mini-orbes (58px). Estilo Diablo.
- **aneis** — 6 medidores circulares (conic-gradient).
- **barras** — 6 barras horizontais.
- **cristal** — barras com recorte angular (clip-path).

## Disposições
- **unido** — tudo num painel de pedra único (inferior esquerdo).
- **separado** — cada elemento no seu próprio suporte de pedra.
- **classico** — orbes flanqueando: Vida à esquerda, Mana empurrada para a direita
  (`right: 22` no container), estilo Diablo II.

## Design tokens

### Paletas (`accent` / `deep` / `glow` / `stone` / `stone2`)
- pergaminho: `#d9b25e` / `#6e4f1c` / `rgba(217,178,94,.5)` / `#181208` / `#22190c`
- sangue:     `#c75b4a` / `#5e1f18` / `rgba(199,91,74,.5)`  / `#1a1010` / `#241413`
- eterno:     `#a87fe0` / `#3e2767` / `rgba(168,127,224,.5)`/ `#150f1d` / `#1f1630`
- esmeralda:  `#5fb87a` / `#1f5236` / `rgba(95,184,122,.5)` / `#0e1611` / `#142019`
- geada:      `#6fc2d6` / `#1f4e5e` / `rgba(111,194,214,.5)`/ `#0d141a` / `#131e26`
- cinzas:     `#bcae98` / `#5a5040` / `rgba(188,174,152,.45)`/ `#15130f`/ `#1f1c16`

### Matiz oklch por atributo (preenchimento dos vitais)
vida 25 · fôlego 135 · fome 60 · sede 230 · sanidade 185 · mana 295.
Cor base: `oklch(0.62 0.15 <hue>)`; com alpha: `oklch(0.62 0.15 <hue> / <a>)`.
**⚠️ Nunca** concatene alpha hexadecimal em `oklch()` (`${col}cc` é inválido e zera o
preenchimento) — use sempre a forma `/ <alpha>`.

### Tipografia
- Display/títulos: **Cinzel Decorative** 900 (nome do servidor, sigilo, lua).
- Texto serifado: **Cinzel** 600–700 (valores grandes, relógio).
- Labels/números mono: **JetBrains Mono** (caixa alta, letter-spacing 1–2px, `#9c8458`).

### Medidas-chave
- Orb grande 96px (borda dourada 3px → poço interno `inset:3`); mini-orb 58px.
- Anel 62px; barra altura 11px; minimapa 220×160; anel de voz 42px.
- Painéis: `border-radius:5px`, borda `rgba(180,140,70,.4)`, cantos losango 7px girados 45°.

### Sombras / efeitos
- Bezel da orb: gradiente radial dourado + `box-shadow` externo + aura colorida do atributo
  (`0 0 22px oklch(...hue.../.3)`) + relevos internos. Ver `Orb` no `.tsx`.
- Animações (keyframes no `.tsx`): `hud-meniscus` (superfície do líquido), `hud-sheen`
  (reflexo varrendo), `hud-ember` (brasas), `hud-voiceripple`, `hud-lowpulse` (Vida < 30%),
  `hud-glowpulse` (ponto "online").

## Comportamento / estados
- **Vida < 30%** → a orb pulsa em vermelho (`hud-lowpulse`).
- **voice.talking** → anel acende + ripple; barrinhas animam.
- Transições suaves de `height`/`width` (500ms) ao mudar os valores dos vitais.
- A troca de `skin`/`style`/`layout` é instantânea (sem transição nos botões — evita
  resíduo de borda; foi um bug corrigido no protótipo).

## Arquivos neste pacote
- `SupernaturalHud.tsx` — componente React (use este).
- `HUD Sobrenatural.dc.html` — protótipo de referência (todas as combinações).
