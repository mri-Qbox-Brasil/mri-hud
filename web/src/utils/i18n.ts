import { create } from "zustand";

type Translation = Record<string, string>;

interface I18nState {
  translations: Translation;
  setTranslations: (t: Translation) => void;
}

/**
 * Fallback EN embutido — usado no modo debug/browser (sem FiveM), antes do
 * cliente Lua enviar o dict via ox_lib (`setLocales`). Em produção o Lua manda
 * `lib.getLocales()` e sobrescreve isto (ver eventHandler `setLocales`).
 *
 * Fonte canônica das traduções: `locales/en.json` / `locales/pt-br.json` (ox_lib).
 * Só as chaves `menu.*` moram aqui — a NUI não usa `notify.*` / `info.*`.
 */
const defaultTranslations: Translation = {
  "menu.tabs.preferences": "Preferences",
  "menu.tabs.appearance": "Appearance",
  "menu.tabs.icons": "Status Icons",

  "menu.reset.hud": "Reset HUD",
  "menu.reset.resetting": "Resetting Hud...",
  "menu.reset.hud_desc": "If your hud is acting up, give it a good ol' reset! Or you can do /resethud",
  "menu.reset.settings": "Reset Settings",
  "menu.reset.settings_desc_1": "If you want to reset your settings back to default; click this shiny button!",
  "menu.reset.settings_desc_2": "(you will have to relog for your menu to reset changes successfully)",

  "menu.positioning.title": "Positioning",
  "menu.positioning.open": "Open Positioning Mode",
  "menu.positioning.open_desc": "Drag, resize and hide HUD elements freely",
  "menu.positioning.reset_all": "Reset All Positions",
  "menu.positioning.reset_all_desc": "Resets every element back to its default position and size",
  "menu.positioning.mode_title": "Positioning Mode — Drag elements to reposition them",
  "menu.positioning.show_all": "Show all",
  "menu.positioning.reset_all_short": "Reset All",
  "menu.positioning.close": "Done",

  "menu.options.title": "Options",
  "menu.options.minimap_vehicle": "Show Minimap Only in Vehicle",
  "menu.options.minimap_vehicle_desc": "Disabling this will always keep your minimap on your screen",
  "menu.options.compass_vehicle": "Show Compass Only in Vehicle",
  "menu.options.compass_vehicle_desc": "Disabling this will always keep your compass on your screen",
  "menu.options.compass_follow": "Show Compass Follow Cam",
  "menu.options.compass_follow_desc": "Disabling this will make it so you can no longer use your mouse to rotate the compass around",

  "menu.notifications.title": "Notifications",
  "menu.notifications.menu_sounds": "Menu Sound Effect Enabled",
  "menu.notifications.reset_sounds": "Reset Hud Sound Effects Enabled",
  "menu.notifications.gui_sounds": "GUI Sound Effects Enabled",
  "menu.notifications.map": "Map Notifications Enabled",
  "menu.notifications.low_fuel": "Low Fuel Alert Enabled",
  "menu.notifications.cinematic": "Cinematic Mode Notifications",

  "menu.status.title": "Status",
  "menu.status.show_health": "Show Health Always",
  "menu.status.show_armor": "Show Armor Always",
  "menu.status.show_hunger": "Show Hunger Always",
  "menu.status.show_thirst": "Show Thirst Always",
  "menu.status.show_stress": "Show Stress Always",
  "menu.status.show_oxygen": "Show Oxygen Always",

  "menu.vehicle.title": "Vehicle",
  "menu.vehicle.minimap_type_desc": "Whether it's square or circle you desire, you have the ability to choose!",
  "menu.vehicle.minimap_circle": "Minimap Circle",
  "menu.vehicle.minimap_square": "Minimap Square",
  "menu.vehicle.metrics_desc": "Choose your preferred unit of measurement",
  "menu.vehicle.metrics_kmh": "KM/H",
  "menu.vehicle.metrics_mph": "MPH",
  "menu.vehicle.minimap_enabled": "Minimap Enabled",
  "menu.vehicle.show_engine": "Show Engine Always",
  "menu.vehicle.show_nitro": "Show Nitro Always",

  "menu.compass.title": "Compass",
  "menu.compass.enabled": "Compass Enabled",
  "menu.compass.enabled_desc": "Disabling this will make it so you can't see the compass navigation",
  "menu.compass.street_names": "Show Street Names Enabled",
  "menu.compass.street_names_desc": "Disabling this will make it so you can't see the street names / locations",
  "menu.compass.pointer": "Show Compass Pointer Enabled",
  "menu.compass.pointer_desc": "Disabling this will make it so you can't see your pointer index to pinpoint your exact cardinal directions",
  "menu.compass.type": "Compass Type",
  "menu.compass.type_desc": "Compass visual style (classic strip or digital)",

  "menu.cinematic.title": "Cinematic Mode",
  "menu.cinematic.bars": "Show Cinematic Bars Enabled",

  "menu.appearance.vehicle_theme": "Vehicle HUD Theme",
  "menu.appearance.theme_classic": "Classic",
  "menu.appearance.theme_digital": "Digital",
  "menu.appearance.vehicle_theme_desc": "Switch between the classic analog speedometer and the digital cluster",
  "menu.appearance.vehicle_theme_admin": "Only admins can change the vehicle HUD theme",
  "menu.appearance.speedo_variant": "Speedometer Format",
  "menu.appearance.speedo_variant_desc": "Format of the digital speedometer: ring, arc or linear",
  "menu.appearance.player_skin": "Player HUD Skin",
  "menu.appearance.skin_classic": "Classic",
  "menu.appearance.skin_supernatural": "Supernatural",
  "menu.appearance.player_skin_desc": "Switch between the classic player HUD and the supernatural skin (vitals, money, server)",
  "menu.appearance.player_skin_admin": "Only admins can change the player HUD skin",
  "menu.appearance.skin_palette": "Palette",
  "menu.appearance.skin_style": "Vitals Style",
  "menu.appearance.skin_layout": "Layout",
  "menu.appearance.skin_frameless": "Remove backgrounds (orbs + money)",
  "menu.appearance.custom_palette": "Custom Colors",
  "menu.appearance.custom_palette_desc": "Free colors used by frames, money and voice",
  "menu.appearance.custom_accent": "Accent",
  "menu.appearance.custom_deep": "Depth",
  "menu.appearance.custom_stone": "Stone",

  "menu.icons.settings": "Status Icons Settings",
  "menu.icons.design_mode": "Design Mode",
  "menu.icons.reset": "Reset Status Icon Settings",
  "menu.icons.save_server": "Save Changes To Server",
  "menu.icons.notice_title": "Icons controlled by the active skin",
  "menu.icons.notice_body": "The Supernatural skin draws its own vitals (orbs / rings / bars). The icon shape, color and layout settings here have no effect while it's active. Switch back to the Classic skin (Appearance tab) to customize the status icons.",
  "menu.icons.skin_title": "Supernatural Customization",
  "menu.icons.skin_desc": "Per-vital color, glyph and label for the supernatural skin. Position and scale stay in positioning mode (F10).",
  "menu.icons.reset_all": "Reset All",
  "menu.icons.vital_color": "Color",
  "menu.icons.vital_glyph": "Glyph",
  "menu.icons.vital_label": "Label",
  "menu.icons.vital_visible": "Visible",
  "menu.icons.glyph_default": "Default",
  "menu.icons.global_settings": "Global Status Icons Settings",
  "menu.icons.shape": "Icon Shape",
  "menu.icons.global_size_section": "Global Size & Position Section",
  "menu.icons.width": "Width Size",
  "menu.icons.height": "Height Size",
  "menu.icons.ring_size": "Ring Size",
  "menu.icons.show_outline": "Show Progress Outline",
  "menu.icons.x_pos": "X-Axis Position",
  "menu.icons.y_pos": "Y-Axis Position",
  "menu.icons.rotation": "Rotation",
  "menu.icons.icon_x_pos": "Icon X-Axis Position",
  "menu.icons.icon_y_pos": "Icon Y-Axis Position",
  "menu.icons.icon_size": "Icon Size",
  "menu.icons.x_curve": "X-Axis Curve",
  "menu.icons.y_curve": "Y-Axis Curve",
  "menu.icons.global_color_section": "Global Color Section",
  "menu.icons.progress_color": "Progress Color",
  "menu.icons.progress_contrast": "Progress Contrast",
  "menu.icons.progress_shadow": "Progress Shadow",
  "menu.icons.icon_color": "Icon Color",
  "menu.icons.icon_contrast": "Icon Contrast",
  "menu.icons.icon_shadow": "Icon Shadow",
  "menu.icons.outline_color": "Outline Color",
  "menu.icons.outline_contrast": "Outline Contrast",
  "menu.icons.outline_shadow": "Outline Shadow",
  "menu.icons.inner_color": "Inner Color",
  "menu.icons.single_settings": "Single Status Icon Settings",
  "menu.icons.status_to_edit": "Icon Status To Edit",
  "menu.icons.single_size_section": "Single Icon Size & Position Section",
  "menu.icons.single_color_section": "Single Icon Color Section",
  "menu.icons.layout_settings": "Global Status Icon Layout Settings",
  "menu.icons.layout": "Icon Layout",
  "menu.icons.state": "Icon State",
  "menu.icons.between_spacing": "Between Icon Spacing",
  "menu.icons.y_spacing": "Y-Axis Spacing",
  "menu.icons.x_spacing": "X-Axis Spacing",
  "menu.icons.utility": "Utility Functions",
  "menu.icons.copy_colors": "Copy Progress Colors To Icon Colors",
  "menu.icons.profiles": "Customization Profiles",
  "menu.icons.add_profile": "Add New Profile",
  "menu.icons.save_profile": "Save HUD To Profile",
  "menu.icons.apply_profile": "Apply Profile To HUD",
  "menu.icons.delete_profile": "Delete Profile",
};

export const useI18nStore = create<I18nState>((set) => ({
  translations: defaultTranslations,
  // Merge sobre o default: chaves ausentes no dict do Lua caem no fallback EN.
  setTranslations: (t) => set({ translations: { ...defaultTranslations, ...t } }),
}));

/**
 * Hook de tradução reativo estilo ox_lib. Uso:
 *   const t = useT();
 *   t("menu.tabs.preferences")
 *   t("menu.some.key", { name: "Bob" })  // interpola %{name}
 * Re-renderiza quando o dict muda (ex.: quando o Lua envia `setLocales`).
 */
export function useT() {
  const dict = useI18nStore((s) => s.translations);
  return (key: string, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? key;
    if (vars) {
      for (const k in vars) str = str.replace(new RegExp(`%\\{${k}\\}`, "g"), String(vars[k]));
    }
    return str;
  };
}
