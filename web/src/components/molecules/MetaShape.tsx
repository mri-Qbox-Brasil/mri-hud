import type { optionalHudIconMetaShapeType } from "../../types/types";
import Badge from "./hud-shapes/Badge";
import CircleRing from "./hud-shapes/CircleRing";
import CircleFill from "./hud-shapes/CircleFill";
import DiamondRing from "./hud-shapes/DiamondRing";
import HexagonRing from "./hud-shapes/HexagonRing";
import HorizontalBar from "./hud-shapes/HorizontalBar";
import IconPercentage from "./hud-shapes/IconPercentage";
import InnerCircle from "./hud-shapes/InnerCircle";
import PillRing from "./hud-shapes/PillRing";
import SplitCircle from "./hud-shapes/SplitCircle";
import SquareFill from "./hud-shapes/SquareFill";
import SquareRing from "./hud-shapes/SquareRing";
import StarRing from "./hud-shapes/StarRing";
import Transparent from "./hud-shapes/Transparent";
import TriangleRing from "./hud-shapes/TriangleRing";

interface Props {
  hudIconInfo: optionalHudIconMetaShapeType;
}

export default function MetaShape({ hudIconInfo }: Props) {
  const { shape, isShowing, ...shapeProps } = hudIconInfo as any;

  switch (shape) {
    case "badge": return <Badge {...shapeProps} />;
    case "circle-ring": return <CircleRing {...shapeProps} />;
    case "circle-fill": return <CircleFill {...shapeProps} />;
    case "diamond-ring": return <DiamondRing {...shapeProps} />;
    case "hexagon-ring": return <HexagonRing {...shapeProps} />;
    case "horizontal-bar": return <HorizontalBar {...shapeProps} />;
    case "icon-percentage": return <IconPercentage {...shapeProps} />;
    case "inner-circle": return <InnerCircle {...shapeProps} />;
    case "pill-ring": return <PillRing {...shapeProps} />;
    case "split-circle": return <SplitCircle {...shapeProps} />;
    case "square-fill": return <SquareFill {...shapeProps} />;
    case "square-ring": return <SquareRing {...shapeProps} />;
    case "star-ring": return <StarRing {...shapeProps} />;
    case "transparent": return <Transparent {...shapeProps} />;
    case "triangle-ring": return <TriangleRing {...shapeProps} />;
    default: return <CircleRing {...shapeProps} />;
  }
}
