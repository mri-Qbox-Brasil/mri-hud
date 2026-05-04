import { useContext, type CSSProperties, type ReactNode } from "react";
import { HudScaleContext } from "./hudScaleContext";

interface Props {
    style?: CSSProperties;
    children: ReactNode;
}

export default function ScaledHudContent({ style, children }: Props) {
    const scale = useContext(HudScaleContext);
    return (
        <div style={style}>
            <div style={{
                display: "inline-block",
                transform: scale !== 1 ? `scale(${scale})` : undefined,
                transformOrigin: "center",
            }}>
                {children}
            </div>
        </div>
    );
}
