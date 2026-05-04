import { useState } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Props {
  name: string;
  icon?: IconDefinition | null;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Panel({ name, icon = null, color = "white", children, defaultOpen = false }: Props) {
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
        className="w-full flex flex-row items-center text-lg font-semibold px-3 py-3 bg-transparent border-none cursor-pointer text-left focus:outline-none"
        style={{ color: "rgba(147,197,253,0.9)" }}
      >
        <div className="w-8 grid place-items-center shrink-0">
          {iconPathData && (
            <svg width="16" height="16" viewBox={`0 0 ${vbW} ${vbH}`}>
              <path d={iconPathData} fill={color} />
            </svg>
          )}
        </div>
        <p className="ml-3">{name}</p>
        <span
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", lineHeight: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="rgba(147,197,253,0.7)" fill="rgba(147,197,253,0.7)">
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
          </svg>
        </span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}
