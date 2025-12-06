import { Flex, Card } from "antd";
import CallModel from "./CallModel";
import ModelResult from "./ModelResult";
import { useState } from "react";
import { TrademarkOutlined } from "@ant-design/icons";

export default function index() {
  const [result, setResult] = useState<string>("请输入图片进行模型推理。");
  const [resultType, setResultType] = useState<"normal" | "error">("error");

  const handleAnalyzeResult = (res: string, type: "normal" | "error") => {
    setResult(res);
    setResultType(type);
  };

  return (
    <Flex gap="0.5rem" vertical style={{ height: "100%" }}>
      <CallModel onFinish={handleAnalyzeResult} />
      <Card
        title={
          <>
            <TrademarkOutlined />
            &nbsp;&nbsp;推理结果
          </>
        }
        style={{ flexGrow: 1 }}
        styles={{ body: { maxHeight: 300, overflowY: "scroll" } }}>
        <ModelResult text={result} type={resultType} />
      </Card>
    </Flex>
  );
}
