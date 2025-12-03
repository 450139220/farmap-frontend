import { TrademarkOutlined } from "@ant-design/icons";
import { Card } from "antd";

export default function ModelResult() {
  return (
    <Card
      title={
        <>
          <TrademarkOutlined />
          &nbsp;&nbsp;推理结果
        </>
      }
      style={{ flexGrow: 1 }}>
      ModelResult
    </Card>
  );
}
