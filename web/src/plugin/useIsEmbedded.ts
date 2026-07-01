// Detecta se o plugin esta rodando dentro do mri_Qadmin (modo embedded) ou
// standalone (a NUI propria do HUD).
//
// IMPORTANTE: NAO pode usar `window.self !== window.top` no FiveM, porque
// toda NUI do FiveM ja roda dentro de um iframe do CEF — entao essa
// verificacao da true mesmo em standalone, fazendo o plugin cair no modo
// embedded e travar em loading eterno esperando init que nunca vem.
//
// Sinal confiavel: query param `?embedded=1`, que o Qadmin injeta na URL
// do iframe via MriPluginHost. Standalone abre sem query → false.

export const useIsEmbedded = (): boolean => {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('embedded') === '1'
}
