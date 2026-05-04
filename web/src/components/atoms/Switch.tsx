interface Props {
  checked: boolean;
  checkedText?: string;
  uncheckedText?: string;
  center?: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch({ checked, checkedText = "", uncheckedText = "", center = false, onChange }: Props) {
  return (
    <div
      className="cursor-pointer flex flex-row pt-2 pb-4 gap-1 select-none"
      style={center ? { justifyContent: "center" } : {}}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          position: "relative",
          width: "2.2rem",
          height: "1.1rem",
          borderRadius: "25px",
          border: `1px solid ${checked ? "rgba(59,130,246,0.8)" : "rgba(59,130,246,0.3)"}`,
          backgroundColor: checked ? "rgba(37,99,235,0.9)" : "rgba(15,23,42,0.9)",
          margin: "0 1rem",
          flexShrink: 0,
          transition: "background-color 0.4s, border-color 0.4s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-0.30rem",
            left: 0,
            width: "1.7rem",
            height: "1.7rem",
            borderRadius: "50%",
            border: "solid 1.25px black",
            backgroundColor: "rgba(37,99,235,1)",
            filter: checked ? "brightness(0.55)" : "brightness(1.2)",
            boxShadow: "2px 2px 5px 0px rgba(0,0,0,0.75)",
            transform: checked ? "translateX(20px)" : "translateX(0)",
            transition: "transform 0.4s, filter 0.4s",
          }}
        />
      </div>
      {checkedText && uncheckedText ? (
        <span className="text-[1.2em] leading-tight">{checked ? checkedText : uncheckedText}</span>
      ) : null}
    </div>
  );
}
