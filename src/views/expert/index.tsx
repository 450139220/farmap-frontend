import { Card, Divider, Flex } from "antd";

import { useEffect, useState } from "react";
import RevisionBox from "./RevisionBox";
import { req } from "@/utils/reqeust";
import { CoffeeOutlined, CommentOutlined, OrderedListOutlined } from "@ant-design/icons";

import { permanence } from "@/utils/permanence";
import DetailPrevew from "./preview//DetailPrevew";
const token = permanence.token.useToken();

export default function Expert() {
  // --- States ---

  // Expert pending cases
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);

  // Selection & details
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  // PERF: set loading animations
  const [detailLoading, setDetailLoading] = useState(false);
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
  const [detail, setDetail] = useState<Omit<CaseContent, "onClear">>(initialCaseContent);
  const [revisionPrompts, setRevisionPrompts] = useState("");

  // Submit revision request
  const [submitting, setSubmitting] = useState(false);

  // --- Effects ---

  // Fetch pending cases list
  useEffect(() => {
    fecthList();
  }, []);

  useEffect(() => {
    if (selectedRequestId) {
      fetchCaseDetail(selectedRequestId);
    }
  }, [selectedRequestId]);

  // --- Handlers ---
  async function fecthList() {
    try {
      const resp = await req.get<CasesStoreResult>("/expert/pending-cases", {
        Authorization: `Bearer ${token}`,
      });
      setPendingCases(resp.data.list);
    } catch {
      console.log("[FARMAP]: failed to fetch expert pending cases.");
    }
  }

  async function fetchCaseDetail(id: string) {
    setDetailLoading(true);
    try {
      const resp = await req.get<{ data: CaseContent }>(`/expert/cases/${id}`, {
        Authorization: token,
      });
      console.log(resp.data);

      setDetail(resp.data);
    } catch {
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <Flex gap="0.5rem" style={{ height: "100%" }}>
      <Card
        title={
          <>
            <OrderedListOutlined />
            &nbsp;&nbsp;待修改列表
          </>
        }
        style={{ flex: 0, maxWidth: 200 }}
        styles={{ body: { height: "calc(100% - 84px - 0.5rem)" } }}>
        <div style={{ marginBottom: "0.5rem" }}>请点击列表内容以开始校正。</div>
        <div
          style={{
            fontSize: "0.7rem",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 2,
            overflowY: "scroll",
            height: "calc(100% - 1rem)",
          }}>
          {pendingCases.map((cs) => (
            <div
              key={cs.requestId}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedRequestId(cs.requestId);
              }}>
              <p>
                <span style={{ backgroundColor: "#ffdd00" }}>#{cs.requestId.substring(0, 8)}</span>
              </p>
              <div>{cs.uploadTime.substring(0, 10)}</div>
              <div>{cs.imageCount} 张图片</div>
              <div>已修改 {cs.revisionCount} 次 </div>
              <Divider style={{ margin: 5 }} />
            </div>
          ))}
        </div>
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
          <DetailPrevew
            requestId={selectedRequestId}
            header={detail.userRequestInfo}
            content={detail.initialResultInfo}
          />
        </Card>
      </Flex>
    </Flex>
  );
}

// <RevisionBox {...caseContent} onClear={onCaseContentClear} />
