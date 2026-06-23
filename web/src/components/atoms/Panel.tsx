import { useState } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Props {
  name: string;
  icon?: IconDefinition | null;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// Accordion de seccao dos paineis de settings. Re-tintado com tokens shadcn
// (texto primary, chevron muted) pra reagir ao accent da suite.
export default function Panel({ name, icon = null, color = "currentColor", children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  let iconPathData: string | null = null;
  let vbW = 512, vbH = 512;
  if (icon) {
    vbW = icon.icon[0];
    vbH = icon.icon[1];
    const p = icon.icon[4];
    iconPathData = Array.isArray(p) ? p[0] : p;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex flex-row items-center text-lg font-semibold px-3 py-3 bg-transparent border-none cursor-pointer text-left text-foreground hover:text-primary transition-colors focus:outline-none"
      >
        <div className="w-8 grid place-items-center shrink-0 text-muted-foreground">
          {iconPathData && (
            <svg width="16" height="16" viewBox={`0 0 ${vbW} ${vbH}`}>
              <path d={iconPathData} fill={color === "white" ? "currentColor" : color} />
            </svg>
          )}
        </div>
        <p className="ml-3">{name}</p>
        <span
          className="ml-auto transition-transform duration-200 text-muted-foreground"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", lineHeight: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="currentColor">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
