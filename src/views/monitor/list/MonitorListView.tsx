import { req } from "@/utils/reqeust";
import { monitorList } from "./monitorList";
import { useMemo, useState } from "react";
import { Divider, Flex } from "antd";

interface VideoRequestResponse {
  code: number;
  msg: string;
  data: { previewUrl: string; playbackUrl: string };
}

interface Props {
  accessToken: string;
  onSelect: (url: string) => void;
}
export default function MonitorListView(props: Props) {
  // PERF: actually each user has his own monitors
  const [selected, setSelected] = useState<number>(-1);
  const selectedMonitorName = useMemo(
    () => monitorList[selected]?.name,
    [selected],
  );
  console.log(props);

  const handleSelect = async (
    id: number,
    deviceSerial: string,
  ): Promise<void> => {
    try {
      console.log(props.accessToken);

      // TODO: remove all localhost
      const resp = await req.get<VideoRequestResponse>(
        `/monitor/preview?accessToken=${props.accessToken}&deviceSerial=${deviceSerial}`,
      );

      // Set preview url to the iframe
      props.onSelect(resp.data.previewUrl);
      setSelected(id);
    } catch {
      props.onSelect("");
      // setSelected(-1);
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <Flex gap="0.5rem">
        <h4 style={{ padding: 0, margin: 0 }}>当前选中摄像头</h4>
        <span>{selectedMonitorName ?? "暂未选择"}</span>
      </Flex>
      <Divider />
      <section
        style={{
          height: "calc(100% - 40px)",
          overflowY: "scroll",
          border: "1px solid gray",
        }}>
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {monitorList.map((li) => (
            <li
              style={{ color: selected === li.id ? "red" : "gray" }}
              key={li.id}
              onClick={() => {
                handleSelect(li.id, li.serial);
              }}>
              {li.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
