import { req } from "@/utils/reqeust";
import { monitorList } from "./monitorList";
import { useMemo, useState } from "react";
import { Divider, Flex } from "antd";

interface VideoRequestRequest {
  Object: null;
  productId: string;
  deviceSerial: string;
  channelNo: number;
  videoLevel: number;
  recordType: number;
}

interface VideoRequestResponse {
  code: number;
  msg: string;
  data: { previewUrl: string; playbackUrl: string };
}

interface Props {
  accessToken: string;
  productId: string;
  onSelect: (url: string) => void;
}
export default function MonitorListView(props: Props) {
  // PERF: actually we should put the monitors list to the server side
  // and each user has his own monitors
  const [selected, setSelected] = useState<number>(-1);
  const selectedMonitorName = useMemo(() => monitorList[selected]?.name, [selected]);

  const handleSelect = async (id: number, deviceSerial: string): Promise<void> => {
    try {
      const resp = await req.post<VideoRequestRequest, VideoRequestResponse>(
        `https://open.hikyun.com/artemis/api/eits/v1/global/live/video/web?access_token=${props.accessToken}`,
        {
          Object: null,
          productId: props.productId,
          deviceSerial: deviceSerial,
          channelNo: 1,
          videoLevel: 2,
          recordType: 1,
        },
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
