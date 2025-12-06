interface Props {
  jsonData: string;
}
export default function Content(props: Props) {
  return <div style={{ height: "100%", overflowY: "scroll" }}>{props.jsonData}</div>;
}
