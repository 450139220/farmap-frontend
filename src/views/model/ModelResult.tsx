import { useEffect, useState, type JSX } from "react";
import PlantReport from "./PlantReport";

interface Props {
  text: string;
  type: "normal" | "error";
}
export default function ModelResult(props: Props) {
  const [text, setText] = useState<JSX.Element>(<span>{props.text}</span>);
  useEffect(() => {
    if (props.type === "error") {
      const span = <span>{props.text}</span>;
      setText(span);
      return;
    }

    // Get the analyzed result
    const report = <PlantReport jsonString={props.text} />;
    setText(report);
  }, [props]);

  return <>{text}</>;
}
