import { Flex, Card } from "antd";
import CallModel from "./CallModel";
import ModelResult from "./ModelResult";
import { useState } from "react";
import { TrademarkOutlined } from "@ant-design/icons";
import { Loader2 } from "lucide-react";

export default function index() {
  const [result, setResult] = useState<string>("请输入图片进行模型推理。");
  const [resultType, setResultType] = useState<"normal" | "error">("error");

  const handleAnalyzeResult = (res: string, type: "normal" | "error") => {
    setResult(res);
    setResultType(type);
  };

  // Loading ai model result
  const [resultLoading, setResultLoaing] = useState(false);

  return (
    <Flex gap="0.5rem" vertical style={{ height: "100%" }}>
      <CallModel
        onFinish={handleAnalyzeResult}
        onSubmit={() => {
          setResultLoaing(true);
        }}
        onSubmitEnd={() => {
          setResultLoaing(false);
        }}
      />
      <Card
        title={
          <>
            <TrademarkOutlined />
            &nbsp;&nbsp;推理结果
          </>
        }
        style={{ flexGrow: 1 }}
        styles={{ body: { maxHeight: 300, overflowY: "scroll" } }}>
        {resultLoading ? (
          <Loader2 className="w-6 h-6 ml-2 text-blue-500 animate-spin" />
        ) : (
          <ModelResult text={result} type={resultType} />
        )}
      </Card>
    </Flex>
  );
}
