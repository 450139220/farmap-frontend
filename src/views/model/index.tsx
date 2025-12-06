import { Flex } from "antd";
import Upload from "./Upload";
import ModelResult from "./ModelResult";
import { useState } from "react";

export default function index() {
  const [result, setResult] = useState<string>("请输入图片进行模型推理。");
  const [resultType, setResultType] = useState<"normal" | "error">("error");

  const handleAnalyzeResult = (res: string, type: "normal" | "error") => {
    setResult(res);
    setResultType(type);
  };

  return (
    <Flex gap="0.5rem" vertical style={{ height: "100%" }}>
      <Upload onFinish={handleAnalyzeResult} />
      <ModelResult text={result} type={resultType} />
    </Flex>
  );
}
