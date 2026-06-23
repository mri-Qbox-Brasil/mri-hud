import { create } from "zustand";

type Translation = Record<string, string>;

interface I18nState {
  translations: Translation;
  setTranslations: (t: Translation) => void;
}

const defaultTranslations: Translation = {
  hudSettings: "HUD Settings",
  statusIcons: "Status Icons",
  generalTab: "General",
  customizationTab: "Customization",
  resetHud: "Reset HUD",
  resetSettings: "Reset Settings",
  resettingHud: "Resetting Hud...",
  resetHudDescription:
    "If your hud is acting up, give it a good ol' reset! Or you can do /resethud",
  resetSettingsDescriptionLine1:
    "If you want to reset your settings back to default; click this shiny button!",
  resetSettingsDescriptionLine2:
    "(you will have to relog for your menu to reset changes successfully)",
  optionsMenu: "Options",
  minimapVehicleCheckBoxPrimary: "Show Minimap Only in Vehicle",
  minimapVehicleCheckBoxSecondary:
    "Disabling this will always keep your minimap on your screen",
  compassVehicleCheckBoxPrimary: "Show Compass Only in Vehicle",
  compassVehicleCheckBoxSecondary:
    "Disabling this will always keep your compass on your screen",
  compassFollowCheckBoxPrimary: "Show Compass Follow Cam",
  compassFollowCheckBoxSecondary:
    "Disabling this will make it so you can no longer use your mouse to rotate the compass around",
  notificationsMenu: "Notifications",
  menuSoundEffectsEnabled: "Menu Sound Effect Enabled",
  resetSoundEffectsEnabled: "Reset Hud Sound Effects Enabled",
  guiSoundEffectsEnabled: "GUI Sound Effects Enabled",
  mapNotificationsEnabled: "Map Notifications Enabled",
  lowFuelNotificationsEnabled: "Low Fuel Alert Enabled",
  cinematicModeNotificationEnabled: "Cinematic Mode Notifications",
  statusMenu: "Status",
  showHealthAlways: "Show Health Always",
  showArmorAlways: "Show Armor Always",
  showHungerAlways: "Show Hunger Always",
  showThirstAlways: "Show Thirst Always",
  showStressAlways: "Show Stress Always",
  showOxygenAlways: "Show Oxygen Always",
  vehicleMenu: "Vehicle",
  minimapTypeCircle: "Minimap Circle",
  minimapTypeSquare: "Minimap Square",
  minimapTypeDescription:
    "Whether it's square or circle you desire, you have the ability to choose!",
  minimapEnabled: "Minimap Enabled",
  showEngineAlways: "Show Engine Always",
  showNitroAlways: "Show Nitro Always",
  compassMenu: "Compass",
  compassEnabled: "Compass Enabled",
  compassEnabledDescription:
    "Disabling this will make it so you can't see the compass navigation",
  showStreetNamesEnabled: "Show Street Names Enabled",
  showStreetNamesDescription:
    "Disabling this will make it so you can't see the street names / locations",
  showCompassPointerEnabled: "Show Compass Pointer Enabled",
  showCompassPointerDescription:
    "Disabling this will make it so you can't see your pointer index to pinpoint your exact cardinal directions",
  cinematicMenu: "Cinematic Mode",
  showCinematicBarsEnabled: "Show Cinematic Bars Enabled",
  statusIconsSettings: "Status Icons Settings",
  designMode: "Design Mode",
  resetStatusIconSettings: "Reset Status Icon Settings",
  saveChangesToServer: "Save Changes To Server",
  globalStatusIconsSettings: "Global Status Icons Settings",
  iconShape: "Icon Shape",
  globalSizeAndPositionSection: "Global Size & Position Section",
  widthSize: "Width Size",
  heightSize: "Height Size",
  ringSize: "Ring Size",
  showProgressOutline: "Show Progress Outline",
  xAxisPosition: "X-Axis Position",
  yAxisPosition: "Y-Axis Position",
  rotation: "Rotation",
  iconXAxisPosition: "Icon X-Axis Position",
  iconYAxisPosition: "Icon Y-Axis Position",
  iconSize: "Icon Size",
  xAxisCurve: "X-Axis Curve",
  yAxisCurve: "Y-Axis Curve",
  globalColorSection: "Global Color Section",
  progressColor: "Progress Color",
  progressContrast: "Progress Contrast",
  progressShadow: "Progress Shadow",
  iconColor: "Icon Color",
  iconContrast: "Icon Contrast",
  iconShadow: "Icon Shadow",
  outlineColor: "Outline Color",
  outlineContrast: "Outline Contrast",
  outlineShadow: "Outline Shadow",
  innerColor: "Inner Color",
  singleStatusIconSettings: "Single Status Icon Settings",
  iconStatusToEdit: "Icon Status To Edit",
  singleIconSizeAndPositionSection: "Single Icon Size & Position Section",
  singleIconColorSection: "Single Icon Color Section",
  globalStatusIconLayoutSettings: "Global Status Icon Layout Settings",
  iconLayout: "Icon Layout",
  iconState: "Icon State",
  betweenIconSpacing: "Between Icon Spacing",
  yAxisSpacing: "Y-Axis Spacing",
  xAxisSpacing: "X-Axis Spacing",
  utilityFunctions: "Utility Functions",
  copyProgressColorsToIconsColors: "Copy Progress Colors To Icon Colors",
  customizationProfiles: "Customization Profiles",
  addNewProfile: "Add New Profile",
  saveHudToProfile: "Save HUD To Profile",
  applyProfileToHud: "Apply Profile To HUD",
  deleteProfile: "Delete Profile",
  metricsTypeMiles: "MPH",
  metricsTypeKmh: "KPH",
  metricsTypeDescription: "Choose your preferred unit of measurement",
  positioningMenu: "Positioning",
  openPositioningMode: "Open Positioning Mode",
  openPositioningModeDescription: "Drag, resize and hide HUD elements freely",
  resetAllPositions: "Reset All Positions",
  resetAllPositionsDescription: "Resets every element back to its default position and size",
  positioningModeTitle: "Positioning Mode — Drag elements to reposition them",
  positioningResetAll: "Reset All",
  positioningClose: "Done [F10]",
};

export const useI18nStore = create<I18nState>((set) => ({
  translations: defaultTranslations,
  setTranslations: (t) => set({ translations: t }),
}));

export async function initI18n(locale: string): Promise<void> {
  try {
    const response = await fetch(`./${locale}.json`);
    const translations: Translation = await response.json();
    useI18nStore.getState().setTranslations(translations);
  } catch {
    console.error("Failed to load translations for locale:", locale);
  }
}
