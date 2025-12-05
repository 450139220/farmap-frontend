import { Button, Flex, Form, Input } from "antd";
import LeftDivider from "./LeftDevider";
import TextArea from "antd/es/input/TextArea";
import { analysisResultSections } from "./analysisResultSection";
import { deepCopy } from "@/utils/function";
import { req } from "@/utils/reqeust";
import { permanence } from "@/utils/permanence";

interface RevisionTextProps {
  content: string;
  requestId: string;
  onSubmit: (text: string) => void;
}

export default function RevisionText(props: RevisionTextProps) {
  const jsonData: RevisionTextContent = JSON.parse(props.content);

  const token = permanence.token.useToken();

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={jsonData.analysis_result}
      onFinish={(values) => {
        const revisedAnalysis: RevisionTextContent["analysis_result"] = deepCopy(values);
        revisedAnalysis.树种识别.置信度 = jsonData.analysis_result.树种识别.置信度;

        const revisedJsonData: RevisionTextContent = {
          ...jsonData,
          analysis_result: revisedAnalysis,
        };
        const revisedJsonStr = JSON.stringify(revisedJsonData);

        req
          .post<{}, { data: string }>(
            `/expert/cases/${props.requestId}/revise`,
            {
              revisedJson: revisedJsonStr,
              isAgree: 1,
              revisionNotes: "这是一个修改功能测试",
            },
            { Authorization: `Bearer ${token}` },
          )
          .then((res) => {
            props.onSubmit(res.data);
          })
          .catch(() => {
            props.onSubmit("上传修改失败，请联系管理员。");
          });
      }}
      style={{ maxWidth: "100%" }}>
      {analysisResultSections.map((section) => (
        <div key={section.title}>
          <LeftDivider text={section.title} />
          {section.fields.map((field) => (
            <Form.Item
              label={field.label}
              name={field.name}
              key={field.label}
              labelCol={{ flex: "none" }}
              wrapperCol={{ flex: 1 }}
              style={{ display: "flex", justifyContent: "space-between" }}>
              {field.type === "textarea" ? <TextArea rows={3} /> : <Input />}
            </Form.Item>
          ))}
        </div>
      ))}

      <Button type="primary" htmlType="submit">
        提价结果
      </Button>
    </Form>
  );
}
