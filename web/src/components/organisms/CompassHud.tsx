import { useRef, useEffect, useState } from "react";
import { useCompassHudStore } from "../../stores/compassHudStore";
import { useMenuStore } from "../../stores/menuStore";
import { usePositioningStore } from "../../stores/positioningStore";
import debugMode from "../../stores/debugStore";
import DraggableHudElement from "../atoms/DraggableHudElement";

export default function CompassHud() {
  const show = useCompassHudStore((s) => s.show);
  const heading = useCompassHudStore((s) => s.heading);
  const streetName = useCompassHudStore((s) => s.streetName);
  const crossingRoad = useCompassHudStore((s) => s.crossingRoad);

  const isShowCompassChecked = useMenuStore((s) => s.isShowCompassChecked);
  const isShowStreetsChecked = useMenuStore((s) => s.isShowStreetsChecked);
  const isPointerShowChecked = useMenuStore((s) => s.isPointerShowChecked);
  const positioningActive    = usePositioningStore((s) => s.active);

  // Smoothly tween the viewBox heading, with instant-jump for wraparound
  const [tweened, setTweened] = useState(heading);
  const lastHeadingRef = useRef(heading);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(heading);
  const toRef = useRef<number>(heading);

  useEffect(() => {
    const last = lastHeadingRef.current;
    const isWrap =
      (last > 230 && heading < -50) || (last < -50 && heading > 230);

    if (isWrap) {
      setTweened(heading);
      fromRef.current = heading;
      toRef.current = heading;
      lastHeadingRef.current = heading;
      return;
    }

    lastHeadingRef.current = heading;
    fromRef.current = tweened;
    toRef.current = heading;
    startRef.current = performance.now();

    cancelAnimationFrame(rafRef.current);
    const duration = 600;

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const current = fromRef.current + (toRef.current - fromRef.current) * t;
      setTweened(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [heading]);

  if (!show && !debugMode && !positioningActive) return null;

  return (
    <DraggableHudElement
      id="compassHud"
      label="Bússola"
      zIndex={12}
    >
    <div
      style={{
        position: "absolute",
        margin: "0 auto",
        left: 0,
        right: 0,
        top: "-0.8vh",
        width: 150,
        height: "auto",
      }}
    >
      {(isShowStreetsChecked || debugMode) && (
        <div
          style={{
            position: "relative",
            top: "1.3vh",
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "1.4vh",
            letterSpacing: "0.7px",
            fontVariant: "small-caps",
            fontWeight: 800,
            textShadow:
              "0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "135%",
              whiteSpace: "nowrap",
              color: "rgb(255,255,255)",
            }}
          >
            {debugMode ? "Testing street1" : streetName}
          </div>
          <div
            style={{
              position: "absolute",
              left: "135%",
              whiteSpace: "nowrap",
              color: "rgb(255,255,255)",
            }}
          >
            {debugMode ? "Testing street2" : crossingRoad}
          </div>
        </div>
      )}

      <div style={{ position: "relative" }}>
        {isPointerShowChecked && (
          <div
            style={{
              position: "absolute",
              margin: "0 auto",
              top: "-2%",
              left: 0,
              right: 0,
              fontFamily: "'Yantramanav', sans-serif",
              color: "rgb(255,255,255)",
              fontSize: "2.2vh",
              textAlign: "center",
              textShadow:
                "0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6), 0 0 1px rgba(0,0,0,0.6)",
              zIndex: 1,
            }}
          >
            ˅
          </div>
        )}

        {(isShowCompassChecked || debugMode) && (
          <>
            <svg
              style={{
                position: "relative",
                width: "100%",
                height: "2vh",
                fontFamily: "'Yantramanav', sans-serif",
                fontSize: "0.35vh",
                fontWeight: 700,
              }}
              viewBox={`${tweened} 0 180 5`}
            >
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="-90" />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="-45" />
              <rect width="4.5" stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="0"   />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="45"  />
              <rect width="4.5" stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="90"  />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="135" />
              <rect width="4.5" stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="180" />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="225" />
              <rect width="4.5" stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="270" />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="315" />
              <rect width="4.5" stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="360" />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="9"  x="405" />
              <rect width="3"   stroke="black" fill="white" strokeWidth="0.5" strokeOpacity="0.6" height="20" x="450" />
            </svg>

            <svg
              style={{
                position: "relative",
                width: "100%",
                top: "-0.5vh",
                height: "3.5vh",
                paddingLeft: "0.12vw",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "2vh",
                letterSpacing: "0.7px",
                fontVariant: "small-caps",
                fontWeight: 600,
              }}
              viewBox={`${tweened} 0 180 1.5`}
            >
              <text x="0"   y="1.5" dominantBaseline="middle" textAnchor="middle" fill="yellow">N</text>
              <text x="360" y="1.5" dominantBaseline="middle" textAnchor="middle" fill="yellow">N</text>
              <text x="315" y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">NW</text>
              <text x="-45" y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">NW</text>
              <text x="45"  y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">NE</text>
              <text x="405" y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">NE</text>
              <text x="90"  y="1.5" dominantBaseline="middle" textAnchor="middle" fill="white">E</text>
              <text x="135" y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">SE</text>
              <text x="180" y="1.5" dominantBaseline="middle" textAnchor="middle" fill="white">S</text>
              <text x="225" y="-11" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="1.4vh" fontWeight="800">SW</text>
              <text x="270" y="1.5" dominantBaseline="middle" textAnchor="middle" fill="white">W</text>
            </svg>
          </>
        )}
      </div>
    </div>
    </DraggableHudElement>
  );
}
