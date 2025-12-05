import { useEffect, useState } from "react";
import { Card, Flex } from "antd";
import {
  BarsOutlined,
  FundViewOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import VideoPlayer from "./VideoPlayer";
import MonitorListView from "./list/MonitorListView";

import { req } from "@/utils/reqeust";
import { permanence } from "@/utils/permanence";
import PredictPic from "./PredictPic";

interface AccessTokenResponse {
  accessToken: string;
  expiresAt: number;
}

export default function index() {
  // Get the user's access token
  // TODO: use a proxy
  const localAccessToken = permanence.accessToken.useAccessToken();
  const [accessToken, setAccessToken] = useState<string>("");
  useEffect(() => {
    if (localAccessToken && Date.now() < localAccessToken.expiresAt) {
      setAccessToken(localAccessToken.accessToken);
      return;
    }

    // Request when local token expired
    // TODO: remove all localhost
    req.get<AccessTokenResponse>("/monitor/get-accesstoken").then((resp) => {
      setAccessToken(resp.accessToken);
      permanence.accessToken.setAccessToken({
        accessToken: resp.accessToken,
        expiresAt: resp.expiresAt,
      });
    });
  }, []);

  // Select video in monitor list
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
          style={{ flex: "0 0 300px" }}
          styles={{ body: { height: "calc(300px - 100px)" } }}>
          <MonitorListView
            accessToken={accessToken}
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
          style={{ flex: "1 0 400px" }}
          styles={{ body: { height: "calc(100% - 60px)" } }}>
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
        style={{ flex: "1 0 40%" }}>
        <PredictPic />
      </Card>
    </Flex>
  );
}
