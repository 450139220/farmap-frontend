import { Divider } from "antd";

export default function LeftDivider({ text }: { text: string }) {
  return (
    <Divider orientation="left" orientationMargin="0">
      {text}
    </Divider>
  );
}
