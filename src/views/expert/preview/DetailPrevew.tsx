import { Flex } from "antd";
import Header from "./Header";
import Image from "./Image";
import PromptInput from "../revision/PromptInput";
import PlantAnalysisEditor from "./Content";
import type { CaseContent } from "@/types/expert";

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
            <Flex vertical style={{ height: "calc(100% - 130px)" }}>
              <PlantAnalysisEditor
                jsonData={props.content.jsonData}
                onSubmit={(j) => {
                  // TODO: send request to revise record
                  console.log(j);
                }}
              />
              <PromptInput />
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}
