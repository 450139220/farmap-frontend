import { useState } from "react";

import { Card, Flex, type StepsProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Upload from "./analyze/Upload";
import Progress from "./analyze/Progress";

interface Props {
  onFinish: (res: string, type: "normal" | "error") => void;
}
export default function CallModel(props: Props) {
  // Steps
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepStatus, setStepStatus] = useState<StepsProps["status"]>("process");

  return (
    <Flex gap="0.5rem" style={{ flexGrow: 0 }}>
      <Card
        title={
          <>
            <UploadOutlined />
            &nbsp;&nbsp;上传作物
          </>
        }
        styles={{ body: { height: "calc(100% - 60px)" } }}>
        <Upload
          onProgress={(currProgress, status) => {
            setCurrentStep(currProgress);
            setStepStatus(status);
          }}
          onFinish={props.onFinish}
        />
      </Card>
      <Card title={<>&nbsp;&nbsp;推理进度</>} style={{ flexGrow: 1 }}>
        <Progress currentStep={currentStep} stepStatus={stepStatus} />
      </Card>
    </Flex>
  );
}
