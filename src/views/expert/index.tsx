import { Card, Divider, Flex, List, Typography } from "antd";

import { useEffect, useState } from "react";
import RevisionBox from "./RevisionBox";
import { permanence } from "@/utils/permanence";
import { req } from "@/utils/reqeust";
import { CoffeeOutlined, OrderedListOutlined } from "@ant-design/icons";

function Expert() {
  const token = permanence.token.useToken();

  // expert pending cases
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
  useEffect(() => {
    req
      .get<CasesStoreResult>("/expert/pending-cases", { Authorization: `Bearer ${token}` })
      .then((res) => {
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
    req
      .get<CaseContentResult>(`/expert/cases/${requestId}`, { Authorization: `Bearer ${token}` })
      .then((res) => {
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
        style={{ flex: "0 0 600px", maxWidth: 600 }}
        styles={{ body: { height: "calc(100% - 84px - 0.5rem)" } }}>
        <div style={{ marginBottom: "0.5rem" }}>请点击列表内容以开始校正。</div>
        <List
          size="small"
          bordered
          style={{ height: "100%", overflowX: "scroll" }}
          dataSource={pendingCases}
          renderItem={(item) => (
            <List.Item
              style={{
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: "0.7rem",
              }}
              onClick={() => {
                getPreview(item.requestId);
              }}>
              <Typography.Text mark>[{item.requestId}]</Typography.Text>
              <Divider orientation="vertical" />
              图片数量：{item.imageCount}
              <Divider orientation="vertical" />
              修改次数：{item.revisionCount}
              <Divider orientation="vertical" />
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
          style={{ width: "100%" }}
          styles={{ body: { height: "calc(100% - 60px)" } }}>
          <RevisionBox {...caseContent} onClear={onCaseContentClear} />
        </Card>
      </Flex>
    </Flex>
  );
}

export default Expert;
