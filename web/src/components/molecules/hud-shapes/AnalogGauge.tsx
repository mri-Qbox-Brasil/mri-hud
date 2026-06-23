import { MriAnalogGauge } from "@mriqbox/ui-kit";

interface Props {
  size: number;
  value: number;
  minValue: number;
  maxValue: number;
  /** Arc span as % of full circle (0–100). 75 = 270°. */
  arcLength: number;
  /** Start angle in degrees clockwise from 12 o'clock. */
  rotation: number;
  majorTickInterval: number;
  minorTickCount: number;
  ringSize: number;
  color: string;
  outlineColor: string;
  outlineOpacity: number;
  needleStyle: "needle" | "digital" | "arc";
  showValue: boolean;
  unit?: string;
  label?: string;
  odometer?: string;
}

// Wrapper fino sobre MriAnalogGauge do @mriqbox/ui-kit (mantem a API local).
export default function AnalogGauge(props: Props) {
  return <MriAnalogGauge {...props} />;
}
