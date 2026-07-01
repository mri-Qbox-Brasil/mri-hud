import React from 'react';
import { Sparkles, Skull, Compass, Ghost, Droplet } from 'lucide-react';

// Interfaces compatíveis com o seu HUD
export interface HudStats {
  health: number;    // 0 a 100
  mana: number;      // 0 a 100
  sanity: number;    // 0 a 100 (usado na Ponte das Almas)
}

export interface HudColors {
  primary: string;       // Hex da cor de Vida (ex: #dc2626)
  secondary: string;     // Hex da cor de Mana (ex: #7c3aed)
}

export type ChaliceFrameType = 'gargoyle' | 'runic' | 'chains' | 'minimal';
export type ChaliceLiquidType = 'boiling' | 'vortex' | 'mist' | 'pure';
export type ChaliceIconType = 'skull' | 'cross' | 'bat' | 'potion';

export interface RpgChaliceHudProps {
  stats: HudStats;
  colors: HudColors;
  chaliceFrame: ChaliceFrameType;
  chaliceLiquid: ChaliceLiquidType;
  chaliceIcon: ChaliceIconType;
  showSoulBridge: boolean;
}

// ----------------------------------------------------
// Componente de Renderização Visual dos Cálices RPG
// ----------------------------------------------------
export const RpgChaliceHud: React.FC<RpgChaliceHudProps> = ({
  stats,
  colors,
  chaliceFrame,
  chaliceLiquid,
  chaliceIcon,
  showSoulBridge,
}) => {
  return (
    <div className="relative flex items-center w-full justify-center md:justify-start px-4 py-2">
      {/* Container que alinha os Cálices e limita a Ponte de Alma absolutamente */}
      <div className="relative flex items-center gap-16">

        {/* Ponte das Almas (Soul Bridge) */}
        {showSoulBridge && (
          <div className="absolute left-12 right-12 top-[44px] h-1.5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-y border-stone-800 rounded-full flex items-center justify-center -z-10 shadow-lg">
            {/* Nexo central de runa mística */}
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
                stats.sanity < 30
                  ? 'bg-black border-red-900 text-red-500 animate-pulse shadow-red-950/40'
                  : 'bg-stone-950 border-purple-800 text-purple-400 shadow-purple-950/40 animate-rune-glow'
              }`}
              title="Nexo da Alma: Canaliza sua Sanidade"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* -------------------- 1. CÁLICE DE VIDA (VITALIDADE) -------------------- */}
        <div className="relative w-24 h-24 rounded-full border-4 border-stone-800 bg-stone-950/90 flex items-center justify-center shadow-2xl group transition-all duration-300">

          {/* Suportes do Cálice */}
          {chaliceFrame === 'gargoyle' && (
            <>
              <div className="absolute -left-3 top-1 bottom-1 w-3.5 border-l-2 border-y-2 border-stone-600/60 rounded-l-full pointer-events-none -z-10 animate-gargoyle-pulse" />
              <div className="absolute -right-3 top-1 bottom-1 w-3.5 border-r-2 border-y-2 border-stone-600/60 rounded-r-full pointer-events-none -z-10 animate-gargoyle-pulse" />
              <div className="absolute -bottom-1.5 left-2 right-2 h-3 bg-gradient-to-b from-stone-800 to-stone-900 border-t border-stone-600 rounded-b-md shadow-md pointer-events-none -z-10" />
            </>
          )}
          {chaliceFrame === 'runic' && (
            <>
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-red-500/20 animate-spin-slow pointer-events-none -z-10" />
              <div className="absolute inset-[-5px] rounded-full border border-dashed border-stone-800 pointer-events-none -z-10" />
              <div className="absolute -bottom-1.5 left-3 right-3 h-2.5 bg-red-950/60 border border-red-900/30 rounded-b text-[6px] font-mono text-red-400 flex items-center justify-center tracking-widest pointer-events-none -z-10">
                ᚛VITALIS᚜
              </div>
            </>
          )}
          {chaliceFrame === 'chains' && (
            <>
              <div className="absolute inset-x-3.5 top-0 bottom-0 border-x border-stone-700/40 pointer-events-none z-20" />
              <div className="absolute inset-y-3.5 left-0 right-0 border-y border-stone-700/40 pointer-events-none z-20" />
              <div className="absolute -bottom-2 left-3 right-3 h-3 bg-stone-900 border border-stone-800 rounded-b shadow-lg pointer-events-none -z-10" />
            </>
          )}
          {chaliceFrame === 'minimal' && (
            <div className="absolute -bottom-1 left-6 right-6 h-1.5 bg-stone-700/90 rounded-b-sm pointer-events-none -z-10" />
          )}

          {/* Globo de Vidro Perfeito (Clipping) */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* Nível do Líquido */}
            <div
              className="absolute bottom-0 inset-x-0 transition-all duration-500 ease-out origin-bottom overflow-hidden"
              style={{
                height: `${stats.health}%`,
                backgroundColor: colors.primary,
                boxShadow: `0 0 15px ${colors.primary}`
              }}
            >
              {/* Efeitos Dinâmicos do Elixir */}
              {chaliceLiquid === 'boiling' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="chalice-bubble-item w-1.5 h-1.5 bg-white/30" style={{ left: '15%', animationDelay: '0s', animationDuration: '3s' }} />
                  <div className="chalice-bubble-item w-1 h-1 bg-white/20" style={{ left: '42%', animationDelay: '1.2s', animationDuration: '4.5s' }} />
                  <div className="chalice-bubble-item w-2.5 h-2.5 bg-white/10" style={{ left: '68%', animationDelay: '0.6s', animationDuration: '3.5s' }} />
                  <div className="chalice-bubble-item w-1 h-1 bg-white/25" style={{ left: '30%', animationDelay: '2.5s', animationDuration: '2.8s' }} />
                  <div className="chalice-bubble-item w-1.5 h-1.5 bg-white/15" style={{ left: '85%', animationDelay: '1.7s', animationDuration: '4s' }} />
                </div>
              )}
              {chaliceLiquid === 'vortex' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="chalice-vortex-layer" style={{ border: `2px dashed rgba(255, 255, 255, 0.25)` }} />
                </div>
              )}
              {chaliceLiquid === 'mist' && (
                <div className="absolute inset-0 bg-stone-950/10 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
              )}
            </div>

            {/* Reflexo do vidro */}
            <div className="absolute top-2 left-4 w-12 h-6 bg-white/5 rounded-full blur-[1px] rotate-[-15deg] z-20"></div>
          </div>

          {/* Runa de classe e percentual */}
          <div className="relative z-10 text-center select-none text-stone-100 font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center">
            <div className="mb-0.5">
              {chaliceIcon === 'skull' && <Skull className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'cross' && <Compass className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'bat' && <Ghost className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'potion' && <Droplet className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
            </div>
            <span>{stats.health}%</span>
            <p className="text-[7px] tracking-widest font-mono text-stone-400 uppercase">CORPO</p>
          </div>
        </div>

        {/* -------------------- 2. CÁLICE DE MANA (ALMA) -------------------- */}
        <div className="relative w-24 h-24 rounded-full border-4 border-stone-800 bg-stone-950/90 flex items-center justify-center shadow-2xl group transition-all duration-300">

          {/* Suportes do Cálice */}
          {chaliceFrame === 'gargoyle' && (
            <>
              <div className="absolute -left-3 top-1 bottom-1 w-3.5 border-l-2 border-y-2 border-stone-600/60 rounded-l-full pointer-events-none -z-10 animate-gargoyle-pulse" />
              <div className="absolute -right-3 top-1 bottom-1 w-3.5 border-r-2 border-y-2 border-stone-600/60 rounded-r-full pointer-events-none -z-10 animate-gargoyle-pulse" />
              <div className="absolute -bottom-1.5 left-2 right-2 h-3 bg-gradient-to-b from-stone-800 to-stone-900 border-t border-stone-600 rounded-b-md shadow-md pointer-events-none -z-10" />
            </>
          )}
          {chaliceFrame === 'runic' && (
            <>
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-violet-500/20 animate-spin-slow pointer-events-none -z-10" />
              <div className="absolute inset-[-5px] rounded-full border border-dashed border-stone-800 pointer-events-none -z-10" />
              <div className="absolute -bottom-1.5 left-3 right-3 h-2.5 bg-violet-950/60 border border-violet-900/30 rounded-b text-[6px] font-mono text-violet-400 flex items-center justify-center tracking-widest pointer-events-none -z-10">
                ᚛SPIRITUS᚜
              </div>
            </>
          )}
          {chaliceFrame === 'chains' && (
            <>
              <div className="absolute inset-x-3.5 top-0 bottom-0 border-x border-stone-700/40 pointer-events-none z-20" />
              <div className="absolute inset-y-3.5 left-0 right-0 border-y border-stone-700/40 pointer-events-none z-20" />
              <div className="absolute -bottom-2 left-3 right-3 h-3 bg-stone-900 border border-stone-800 rounded-b shadow-lg pointer-events-none -z-10" />
            </>
          )}
          {chaliceFrame === 'minimal' && (
            <div className="absolute -bottom-1 left-6 right-6 h-1.5 bg-stone-700/90 rounded-b-sm pointer-events-none -z-10" />
          )}

          {/* Globo de Vidro Perfeito (Clipping) */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* Nível do Líquido */}
            <div
              className="absolute bottom-0 inset-x-0 transition-all duration-500 ease-out origin-bottom overflow-hidden"
              style={{
                height: `${stats.mana}%`,
                backgroundColor: colors.secondary,
                boxShadow: `0 0 15px ${colors.secondary}`
              }}
            >
              {/* Efeitos Dinâmicos do Elixir */}
              {chaliceLiquid === 'boiling' && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="chalice-bubble-item w-1.5 h-1.5 bg-white/30" style={{ left: '20%', animationDelay: '0.4s', animationDuration: '3.2s' }} />
                  <div className="chalice-bubble-item w-1 h-1 bg-white/20" style={{ left: '48%', animationDelay: '1.6s', animationDuration: '4.8s' }} />
                  <div className="chalice-bubble-item w-2.5 h-2.5 bg-white/10" style={{ left: '72%', animationDelay: '0.2s', animationDuration: '3.8s' }} />
                  <div className="chalice-bubble-item w-1 h-1 bg-white/25" style={{ left: '35%', animationDelay: '2.8s', animationDuration: '3s' }} />
                  <div className="chalice-bubble-item w-1.5 h-1.5 bg-white/15" style={{ left: '80%', animationDelay: '1.3s', animationDuration: '4.2s' }} />
                </div>
              )}
              {chaliceLiquid === 'vortex' && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="chalice-vortex-layer" style={{ border: `2px dashed rgba(255, 255, 255, 0.25)` }} />
                </div>
              )}
              {chaliceLiquid === 'mist' && (
                <div className="absolute inset-0 bg-stone-950/10 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
              )}
            </div>

            {/* Reflexo do vidro */}
            <div className="absolute top-2 left-4 w-12 h-6 bg-white/5 rounded-full blur-[1px] rotate-[-15deg] z-20"></div>
          </div>

          {/* Nível e Título */}
          <div className="relative z-10 text-center select-none text-stone-100 font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center">
            <div className="mb-0.5">
              {chaliceIcon === 'skull' && <Skull className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'cross' && <Compass className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'bat' && <Ghost className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
              {chaliceIcon === 'potion' && <Droplet className="w-4 h-4 text-stone-200/50 group-hover:text-stone-100/95 transition-colors" />}
            </div>
            <span>{stats.mana}%</span>
            <p className="text-[7px] tracking-widest font-mono text-stone-400 uppercase">ALMA</p>
          </div>
        </div>

      </div>
    </div>
  );
};