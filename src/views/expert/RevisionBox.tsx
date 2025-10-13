import { Select, Descriptions, type DescriptionsProps, Image } from "antd";
import RevisionText from "./RevisionText";

function RevisionBox(props: CaseContent) {
    // TODO: on change to select a new record
    console.log(props);

    const descriptionsItems: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "请求Id",
            children: props.userRequestInfo.requestId,
        },
        {
            key: "2",
            label: "上传时间",
            children: props.userRequestInfo.uploadTime,
        },
        {
            key: "3",
            label: "照片张数",
            children: props.userRequestInfo.imageUrls.split(",").length,
        },
        {
            key: "4",
            label: "模型版本",
            children: props.initialResultInfo.modelVersion,
        },
        {
            key: "5",
            label: "修改记录",
            children: (
                <Select
                    defaultValue={"无"}
                    style={{ width: 120 }}
                    options={props.revisionRecords}
                />
            ),
        },
    ];
    return (
        <>
            {props.userRequestInfo.requestId === "" ? (
                <div>请选择作物。</div>
            ) : (
                <>
                    <Descriptions
                        style={{ marginBottom: "1rem" }}
                        items={descriptionsItems}></Descriptions>
                    <div style={{ marginBottom: "1rem" }}>点击预览后可以翻页查看作物。</div>
                    <Image.PreviewGroup items={[...props.userRequestInfo.imageUrls.split(",")]}>
                        <Image
                            width="100%"
                            src={props.userRequestInfo.imageUrls.split(",")[0]}
                        />
                    </Image.PreviewGroup>
                    <RevisionText content={props.initialResultInfo.jsonData} />
                </>
            )}
        </>
    );
}

export default RevisionBox;
