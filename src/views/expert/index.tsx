import { useUser } from "@/store";
import { useToken } from "@/utils/permanence";
import { request } from "@/utils/reqeust";
import { Card, Divider, Flex, List, Typography } from "antd";
import style from "./index.module.css";

import { useEffect, useState } from "react";
import RevisionBox from "./RevisionBox";

function Expert() {
    const role = useUser((state) => state.role);
    const [token] = useToken();

    // expert pending cases
    const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
    useEffect(() => {
        request.get<CasesStoreResult>("/expert/pending-cases", token).then((res) => {
            setPendingCases(res.data.list);
        });
    }, []);

    const [caseContent, setCaseContent] = useState<CaseContent>({
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
    });
    const getPreview = (requestId: string) => {
        request.get<CaseContentResult>(`/expert/cases/${requestId}`, token).then((res) => {
            setCaseContent(res.data);
        });
    };

    return (
        <>
            {role !== "expert" ? (
                <div>请登陆专家账号！</div>
            ) : (
                <Flex className={style.container}>
                    <Card
                        title={
                            <i
                                className="ri-user-search-fill"
                                style={{ color: "var(--primary)" }}>
                                &nbsp;&nbsp;待修改列表
                            </i>
                        }>
                        <div style={{ marginBottom: "1rem" }}>请点击列表内容以校正。</div>
                        <List
                            size="small"
                            bordered
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
                    <Flex className={style.other__container}>
                        <Card
                            title={
                                <i
                                    className="ri-plant-fill"
                                    style={{ color: "var(--primary)" }}>
                                    &nbsp;&nbsp;当前修改作物
                                </i>
                            }>
                            <RevisionBox {...caseContent} />
                        </Card>
                    </Flex>
                </Flex>
            )}
        </>
    );
}

export default Expert;
