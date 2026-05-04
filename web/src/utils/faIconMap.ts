import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  faBiohazard, faDatabase, faDollarSign, faDumbbell, faExclamation,
  faLightbulb, faLocationArrow, faPersonSwimming, faWind,
  faBolt, faBrain, faCarBattery, faDroplet, faFire, faGasPump,
  faGear, faHeart, faHouse, faInfo, faMeteor, faMicrophone,
  faOilCan, faParachuteBox, faPerson, faQuestion, faRadiation,
  faShield, faSkull, faStar, faTachometerAlt, faThermometerHalf,
  faTriangleExclamation, faTrophy, faUser, faUserSlash, faVirus,
  faWrench, faXmark, faZap,
} from "@fortawesome/free-solid-svg-icons";

const map: Record<string, IconDefinition> = {
  biohazard: faBiohazard,
  database: faDatabase,
  dollarsign: faDollarSign,
  dumbbell: faDumbbell,
  exclamation: faExclamation,
  lightbulb: faLightbulb,
  locationarrow: faLocationArrow,
  swimming: faPersonSwimming,
  wind: faWind,
  bolt: faBolt,
  brain: faBrain,
  carbattery: faCarBattery,
  droplet: faDroplet,
  fire: faFire,
  gaspump: faGasPump,
  gear: faGear,
  heart: faHeart,
  house: faHouse,
  info: faInfo,
  meteor: faMeteor,
  microphone: faMicrophone,
  oilcan: faOilCan,
  parachutebox: faParachuteBox,
  person: faPerson,
  question: faQuestion,
  radiation: faRadiation,
  shield: faShield,
  skull: faSkull,
  star: faStar,
  tachometer: faTachometerAlt,
  thermometer: faThermometerHalf,
  triangle: faTriangleExclamation,
  trophy: faTrophy,
  user: faUser,
  userslash: faUserSlash,
  virus: faVirus,
  wrench: faWrench,
  xmark: faXmark,
  zap: faZap,
};

export function resolveIcon(name?: string): IconDefinition | null {
  if (!name) return null;
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return map[key] ?? null;
}

export default map;
