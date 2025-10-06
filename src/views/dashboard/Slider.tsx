import { useEffect, useRef, useState } from "react";
import style from "./index.module.css";

interface SliderCssVariables extends React.CSSProperties {
  "--l-back-pos"?: string;
  "--r-back-pos"?: string;
}

type SliderPrivateProps = {
  position: {
    left: number;
    right: number;
  };
};
export type SliderProps = {
  value: {
    left: number;
    right: number;
  };
  scale: {
    min: number;
    max: number;
  };
  decimal: boolean;
  onChange: (value: number, type: "left" | "right") => void;
};
function Slider(props: SliderProps) {
  // set initial position through props
  const [position, setPosition] = useState<SliderPrivateProps["position"]>({
    left: ((props.value.left - props.scale.min) / (props.scale.max - props.scale.min)) * 100,
    right: ((props.value.right - props.scale.min) / (props.scale.max - props.scale.min)) * 100,
  });

  // move dots for initiation
  useEffect(() => {
    setPosition({
      left: ((props.value.left - props.scale.min) / (props.scale.max - props.scale.min)) * 100,
      right: ((props.value.right - props.scale.min) / (props.scale.max - props.scale.min)) * 100,
    });
  }, [props.value, props.scale]);

  // get references of container and target
  const sliderContainer = useRef<HTMLDivElement | null>(null);
  const leftTarget = useRef<HTMLDivElement | null>(null);
  const rightTarget = useRef<HTMLDivElement | null>(null);
  const currentTarget = useRef<HTMLDivElement | null>(null);

  // init position
  useEffect(() => {
    if (!leftTarget.current || !rightTarget.current) return;
    leftTarget.current.style.left = `${position.left}%`;
    rightTarget.current.style.left = `${position.right}%`;
  }, []);

  // events
  const isDragging = useRef(false);
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current || !sliderContainer.current) return;

    // get the denominator of calculated left
    const containerRect = sliderContainer.current.getBoundingClientRect();
    const containerLeft = containerRect.left;
    const containerWidth = containerRect.width;
    // get the numerator of calculcated left
    const pointLeft = e.clientX;

    // calculate left
    const type = currentTarget.current!.getAttribute("data-type") as "left" | "right";
    let changing = type;
    let calculatedLeft =
      type === "left"
        ? Math.max(
            0,
            Math.min(((pointLeft - containerLeft) / containerWidth) * 100, position.right),
          )
        : Math.max(
            position.left,
            Math.min(((pointLeft - containerLeft) / containerWidth) * 100, 100),
          );
    // set position state
    setPosition((p) => ({
      left: changing === "left" ? calculatedLeft : p.left,
      right: changing === "right" ? calculatedLeft : p.right,
    }));

    // trigger change event to modify values
    const scale = props.scale.max - props.scale.min;
    props.onChange((calculatedLeft / 100) * scale + props.scale.min, type);
  };
  const handlePointerUp = () => {
    currentTarget.current = null;
    isDragging.current = false;

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };
  // switch upper dot when click
  const upperDot = useRef<"left" | "right">("left");
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // find current dot target
    const target = e.target as HTMLDivElement;
    currentTarget.current = target;
    // adapt z-index
    const type = target.getAttribute("data-type") as "left" | "right";
    upperDot.current = type;

    isDragging.current = true;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="box">
      <div
        className={style.slider__container}
        ref={sliderContainer}>
        <div
          className={style.slider__background}
          style={
            {
              "--l-back-pos": `${position.left}%`,
              "--r-back-pos": `${position.right}%`,
            } as SliderCssVariables
          }></div>

        <div
          className={style.slider__dot}
          data-type="left"
          data-value={!props.decimal ? Math.floor(props.value.left) : props.value.left.toFixed(2)}
          ref={leftTarget}
          style={{ left: `${position.left}%`, zIndex: `${upperDot.current === "left" ? 1 : 0}` }}
          onPointerDown={handlePointerDown}></div>
        <div
          className={style.slider__dot}
          data-type="right"
          data-value={!props.decimal ? Math.floor(props.value.right) : props.value.right.toFixed(2)}
          ref={rightTarget}
          style={{ left: `${position.right}%`, zIndex: `${upperDot.current === "right" ? 1 : 0}` }}
          onPointerDown={handlePointerDown}></div>
      </div>
    </div>
  );
}

export default Slider;
