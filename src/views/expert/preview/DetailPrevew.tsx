import { Flex } from "antd";
import Header from "./Header";
import Image from "./Image";
import PromptInput from "../revision/PromptInput";
import PlantAnalysisEditor from "./Content";
import type { CaseContent } from "@/types/expert";
import { Loader2 } from "lucide-react";
import { req } from "@/utils/reqeust";
import { permanence } from "@/utils/permanence";
import { useState } from "react";

const token = permanence.token.useToken();

interface Props {
  requestId: string | null;
  header: CaseContent["userRequestInfo"];
  content: CaseContent["initialResultInfo"];
  loading: boolean;
}
export default function DetailPrevew(props: Props) {
  const [submistLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  return (
    <>
      {!props.requestId || props.loading ? (
        <>
          {props.loading ? (
            <Flex gap="0.5rem">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <div>记录加载中...</div>
            </Flex>
          ) : (
            <div>请选择记录。</div>
          )}
        </>
      ) : (
        <Flex gap="0.5rem" style={{ height: "100%" }}>
          <Image urls={props.header.imageUrls} />
          <Flex
            vertical
            style={{ flexGrow: 1, maxWidth: "50%", height: "100%" }}>
            <Header
              requestId={props.header.requestId}
              modelVersion={props.content.modelVersion}
            />
            <Flex vertical style={{ height: "calc(100% - 130px)" }}>
              <PlantAnalysisEditor
                jsonData={props.content.jsonData}
                submitLoading={submistLoading}
                submitResult={submitResult}
                onSubmit={async (j) => {
                  try {
                    setSubmitLoading(true);

                    const resp = await req.post<
                      {
                        revisedJson: string;
                        isAgree: 1;
                        revisionNotes: string;
                      },
                      { data: string }
                    >(
                      `/expert/cases/${props.requestId}/revise`,
                      {
                        revisedJson: j,
                        isAgree: 1,
                        revisionNotes: "提交修改111",
                      },
                      { Authorization: `Bearer ${token}` },
                    );

                    setSubmitResult(resp.data);
                  } catch {
                    setSubmitResult("提交修改出错");
                  } finally {
                    setSubmitLoading(false);
                  }
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
