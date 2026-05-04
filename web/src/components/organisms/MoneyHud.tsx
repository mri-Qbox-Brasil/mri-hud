import { useMoneyHudStore } from "../../stores/moneyHudStore";
import DraggableHudElement from "../atoms/DraggableHudElement";

export default function MoneyHud() {
  const cash = useMoneyHudStore((s) => s.cash);
  const bank = useMoneyHudStore((s) => s.bank);
  const show = useMoneyHudStore((s) => s.show);
  const showConstant = useMoneyHudStore((s) => s.showConstant);
  const isPlus = useMoneyHudStore((s) => s.isPlus);
  const isMinus = useMoneyHudStore((s) => s.isMinus);

  const textShadow =
    "-1px -1px 0 rgba(0,0,0,0.7), 1px -1px 0 rgba(0,0,0,0.7), -1px 1px 0 rgba(0,0,0,0.7), 1px 1px 0 rgba(0,0,0,0.7)";

  const pricedownStyle: React.CSSProperties = {
    fontFamily: "'Pricedown Bl', sans-serif",
    textAlign: "right",
    textShadow,
  };

  return (
    <DraggableHudElement
      id="moneyHud"
      label="Dinheiro"
      zIndex={12}
    >
      <div
        style={{
          position: "absolute",
          right: "2vw",
          top: "5vh",
          fontWeight: 400,
          fontSize: 40,
        }}
      >
        {(show || showConstant) && (
          <p>
            <span style={{ ...pricedownStyle, color: "#00ac31" }}>$&nbsp;</span>
            <span style={{ ...pricedownStyle, color: "#ffffff" }}>{cash}</span>
          </p>
        )}
        {(show || showConstant) && (
          <p>
            <span style={{ ...pricedownStyle, color: "#00ac31" }}>$&nbsp;</span>
            <span style={{ ...pricedownStyle, color: "#00ac31" }}>{bank}</span>
          </p>
        )}
        {show && isPlus && (
          <p>
            <span style={{ ...pricedownStyle, fontSize: 50, color: "#00ac31" }}>+&nbsp;</span>
            <span style={{ ...pricedownStyle, color: "#ffffff" }}>{cash}</span>
          </p>
        )}
        {show && isMinus && (
          <p>
            <span style={{ ...pricedownStyle, fontSize: 50, color: "#ac0000" }}>-&nbsp;</span>
            <span style={{ ...pricedownStyle, color: "#ffffff" }}>{cash}</span>
          </p>
        )}
      </div>
    </DraggableHudElement>
  );
}
