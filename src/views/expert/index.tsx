import { Card, Divider, Flex, List, Typography } from "antd";

import { useEffect, useState } from "react";
import RevisionBox from "./RevisionBox";
import { useUserStore } from "@/store/user";
import { permanence } from "@/utils/permanence";
import { req } from "@/utils/reqeust";
import { CoffeeOutlined, OrderedListOutlined } from "@ant-design/icons";

function Expert() {
  const token = permanence.token.useToken();

  // expert pending cases
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
  useEffect(() => {
    req.get<CasesStoreResult>("/expert/pending-cases").then((res) => {
      setPendingCases(res.data.list);
    });
  }, []);

  const initialCaseContent: Omit<CaseContent, "onClear"> = {
    userRequestInfo: {
      requestId: "",
      imageUrls: "",
      uploadTime: "",
      status: 1,
    },
    initialResultInfo: {
      jsonData: "",
      modelVersion: "",
    },
    revisionRecords: [],
  };
  const [caseContent, setCaseContent] = useState<Omit<CaseContent, "onClear">>(initialCaseContent);
  const onCaseContentClear = (): void => {
    setCaseContent(initialCaseContent);
  };
  const getPreview = (requestId: string) => {
    req.get<CaseContentResult>(`/expert/cases/${requestId}`).then((res) => {
      setCaseContent(res.data);
    });
  };

  return (
    <Flex gap="0.5rem" style={{ height: "100%" }}>
      <Card
        title={
          <>
            <OrderedListOutlined />
            &nbsp;&nbsp;待修改列表
          </>
        }
        style={{ flexGrow: 1 }}
        styles={{ body: { height: "calc(100% - 84px - 0.5rem)" } }}>
        <div style={{ marginBottom: "0.5rem" }}>请点击列表内容以开始校正。</div>
        <List
          size="small"
          bordered
          style={{ height: "100%" }}
          dataSource={pendingCases}
          renderItem={(item) => (
            <List.Item
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
              }}
              onClick={() => {
                getPreview(item.requestId);
              }}>
              <Typography.Text mark>[{item.requestId}]</Typography.Text>
              <Divider type="vertical" />
              图片数量：{item.imageCount}
              <Divider type="vertical" />
              修改次数：{item.revisionCount}
              <Divider type="vertical" />
              上传时间：{item.uploadTime}
            </List.Item>
          )}
        />
      </Card>
      <Flex style={{ flexGrow: 1 }}>
        <Card
          title={
            <>
              <CoffeeOutlined />
              &nbsp;&nbsp;当前修改作物
            </>
          }
          style={{ width: "100%" }}>
          <RevisionBox {...caseContent} onClear={onCaseContentClear} />
        </Card>
      </Flex>
    </Flex>
  );
}

export default Expert;
