import { Flex } from "antd";
import Upload from "./Upload";
import ModelResult from "./ModelResult";

export default function index() {
  // TODO: oss
  return (
    <Flex gap="0.5rem" vertical style={{ height: "100%" }}>
      <Upload />
      <ModelResult />
    </Flex>
  );
}
