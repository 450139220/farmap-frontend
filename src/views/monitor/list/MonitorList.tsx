import { req } from "@/utils/reqeust";
import { monitorList } from "./monitorList";

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
export default function MonitorList(props: Props) {
  // TODO: actually we should put the monitors list to the server side
  // and each user has his own monitors

  const handleSelect = async (deviceSerial: string): Promise<void> => {
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
    } catch {
      props.onSelect("");
    }
  };

  return (
    <ul>
      {monitorList.map((li) => (
        <li
          key={li.id}
          onClick={() => {
            handleSelect(li.serial);
          }}>
          {li.name}
        </li>
      ))}
    </ul>
  );
}
