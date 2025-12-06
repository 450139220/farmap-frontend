import { Flex } from "antd";
import Header from "./Header";
import Content from "./Content";
import Image from "./Image";
import RevisionInput from "../revision/RevisionInput";

interface Props {
  requestId: string | null;
  header: CaseContent["userRequestInfo"];
  content: CaseContent["initialResultInfo"];
}
export default function DetailPrevew(props: Props) {
  return (
    <>
      {!props.requestId ? (
        <div>请选择记录。</div>
      ) : (
        <Flex gap="0.5rem" style={{ height: "100%" }}>
          <Image urls={props.header.imageUrls} />
          <Flex vertical style={{ flexGrow: 1, maxWidth: "50%", height: "100%" }}>
            <Header requestId={props.header.requestId} modelVersion={props.content.modelVersion} />
            <Content jsonData={props.content.jsonData} />
            <RevisionInput />
          </Flex>
        </Flex>
      )}
    </>
  );
}
