import {
  BarsOutlined,
  FundViewOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Card, Flex } from "antd";
import VideoPlayer from "./VideoPlayer";
import { useEffect, useState } from "react";
import MonitorList from "./list/MonitorList";

import { monitorKeys } from "./list/keys";
import { req } from "@/utils/reqeust";
import { permanence } from "@/utils/permanence";
const productId = monitorKeys.productId;

interface AccessTokenResponse {
  data: {
    access_token: string;
    expires_in: number;
  };
}

export default function index() {
  // Get the user's access token
  const localAccessToken = permanence.accessToken.useAccessToken();
  const [accessToken, setAccessToken] = useState<string>("");
  useEffect(() => {
    if (localAccessToken && performance.now() < localAccessToken.expiresAt)
      return;
    req
      .post<
        typeof monitorKeys,
        AccessTokenResponse
      >("https://open.hikyun.com/artemis/oauth/token/v2", monitorKeys)
      .then((resp) => {
        setAccessToken(resp.data.access_token);
        permanence.accessToken.setAccessToken({
          accessToken: resp.data.access_token,
          expiresAt: performance.now() + resp.data.expires_in,
        });
      });
  }, []);

  // Select video
  const [selectedVideo, setSelectedVideo] = useState<string>(""); // this is the request url for video
  const getSelectVideoUrl = (url: string): void => {
    setSelectedVideo(url);
  };

  return (
    <Flex gap="0.5rem" style={{ height: "100%" }}>
      <Flex gap="0.5rem" vertical style={{ flexGrow: 1 }}>
        <Card
          title={
            <>
              <BarsOutlined />
              &nbsp;&nbsp;监控列表
            </>
          }
          style={{ flex: "0 0 300px", overflowY: "hidden" }}>
          <MonitorList
            accessToken={accessToken}
            productId={productId}
            onSelect={getSelectVideoUrl}
          />
        </Card>
        <Card
          title={
            <>
              <FundViewOutlined />
              &nbsp;&nbsp;视频预览
            </>
          }
          style={{ flex: "1 0 400px" }}>
          <VideoPlayer videoUrl={selectedVideo} />
        </Card>
      </Flex>
      <Card
        title={
          <>
            <ThunderboltOutlined />
            &nbsp;&nbsp;在线推理
          </>
        }
        style={{ flexGrow: 1 }}></Card>
    </Flex>
  );
}
