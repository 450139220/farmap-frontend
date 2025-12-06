import { req } from "@/utils/reqeust";
import { useState } from "react";

import {
  Button,
  Card,
  Flex,
  Image,
  Steps,
  Upload as UploadAntd,
  type StepsProps,
  type UploadFile,
  type UploadProps,
} from "antd";
import { CloseOutlined, PaperClipOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import COS from "cos-js-sdk-v5";

import { permanence } from "@/utils/permanence";
const token = permanence.token.useToken();

export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface LLModelResponse {
  msg: string | null;
  data: string | null;
}
interface Props {
  onFinish: (res: string, type: "normal" | "error") => void;
}
export default function Upload(props: Props) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Steps
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepStatus, setStepStatus] = useState<StepsProps["status"]>("process");

  const FILE_TYPES = ["image/png", "image/jpeg"];
  const FILE_SIZE = 10 * 1024 * 1024;

  const handleChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    const files = newList
      .map((f) => f.originFileObj)
      .filter((f) => f && FILE_TYPES.includes(f.type) && f.size < FILE_SIZE) as UploadFile[];
    // console.log(files[0] instanceof File);
    setFileList((prev) => [...new Set(prev.concat(files))]);
  };
  const removeFile = (target: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f !== target));
  };

  const uploadFiles = () => {
    if (fileList.length === 0) return;

    const cosFiles: COS.UploadFileParams[] = (fileList as unknown as File[]).map((f) => ({
      Bucket: "halo-prod-1317766785",
      Region: "ap-chongqing",
      Key: `/farmap/usercall-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getHours()}-${f.name}`,
      Body: f,
    }));

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const ossResult: string[] = [];
          // console.log(latitude, longitude);
          // Upload file to OSS
          setIsDisabled(true);
          const secret = await req.get<{ SecretId: string; SecretKey: string }>(
            "https://map.archivemodel.cn/farmap_keys/cos.json",
          );
          const cos = new COS(secret);
          await cos.uploadFiles({
            files: cosFiles,
            SliceSize: 1024 * 1024 * 10,
            // onProgress: (info) => {
            //   console.log(info);
            // },
            onFileFinish: (err, data, options) => {
              ossResult.push("https://" + data.Location);
              setFileList([]);
              if (err) {
                setStepStatus("error");
                throw err;
              }
              setCurrentStep(2);
              setStepStatus("process");
            },
          });
          // Upload to ai for analyzing
          try {
            const aiResp = await req.post<{ imageUrls: string[] }, LLModelResponse>(
              "/ai-model/analyze",
              {
                imageUrls: ossResult,
                // imageUrls: [
                //   "https://halo-prod-1317766785.cos.ap-chongqing.myqcloud.com/farmap/1.jpg",
                // ],
              },
              {
                Authorization: `Bearer ${token}`,
                "X-Api-Key": "sk-Hjh9EBFtQ64WK9niBxBBknJkosxMKLFEdvlVXXaIAqCxVxWI",
              },
            );
            console.log(aiResp);
            if (!aiResp.data) {
              setStepStatus("error");
              props.onFinish(aiResp.msg!, "error");
              throw new Error("请求失败");
            }
            setCurrentStep(3);
            props.onFinish(aiResp.data, "normal");
          } finally {
            ossResult.length = 0;
            setIsDisabled(false);
          }
        },
        (error) => {
          console.log("erro", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } catch (err) {
      console.log("Upload failed", err);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    const blob = new Blob([file as unknown as File], { type: file.type });
    if (!file.url && !file.preview) {
      file.preview = await getBase64(blob as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // LLM analyze steps
  const stepItems = [
    { title: "接收图片", content: "请手动选择图片并点击上传。" },
    { title: "上传图片", content: "将图片上传到服务器中。" },
    { title: "模型推理", content: "推理中..." },
    { title: "展示结果", content: "模型推理完成，请查看推理结果。" },
  ];
  const verticalStepProps: StepsProps = {
    type: "dot",
    items: stepItems,
    orientation: "vertical",
    style: {
      flex: "auto",
    },
  } as const;

  return (
    <Flex gap="0.5rem" style={{ flexGrow: 0 }}>
      <Card
        title={
          <>
            <UploadOutlined />
            &nbsp;&nbsp;上传作物
          </>
        }
        styles={{ body: { height: "calc(100% - 60px)" } }}>
        <div style={{ marginBottom: "1rem" }}>
          建议上传 3-5 张作物照片，且大小不超过 10MB 每张。
          <span style={{ color: "var(--warning)" }}>超出限制的图片将会被丢弃。</span>
        </div>
        <UploadAntd
          listType="picture"
          multiple
          disabled={isDisabled}
          onChange={handleChange}
          onPreview={handlePreview}
          beforeUpload={() => false}
          fileList={fileList}
          itemRender={(_, file) => {
            return (
              <Flex
                className="model_predict-file"
                align="center"
                justify="space-between"
                style={{ marginTop: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handlePreview(file);
                  }}>
                  <PaperClipOutlined />
                  &nbsp;&nbsp;
                  {file.name}
                </span>
                <CloseOutlined
                  onClick={() => {
                    removeFile(file);
                  }}
                />
              </Flex>
            );
          }}
          style={{ width: "100%" }}>
          {fileList.length >= 5 ? null : (
            <div
              style={{
                width: "100%",
                border: "1px dashed #aaa",
                borderRadius: 8,
                padding: "0 1rem",
                cursor: "pointer",
                backgroundColor: "#eee",
              }}>
              <PlusOutlined />
              &nbsp;&nbsp;上传
            </div>
          )}
        </UploadAntd>
        {previewImage && (
          <Image
            styles={{ root: { display: "none" } }}
            preview={{
              open: previewOpen,
              onOpenChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
        <Button
          type="primary"
          style={{ marginTop: "1rem" }}
          onClick={uploadFiles}
          disabled={fileList.length === 0}>
          上传作物并处理
        </Button>
      </Card>
      <Card title={<>&nbsp;&nbsp;推理进度</>} style={{ flexGrow: 1 }}>
        <Steps
          {...verticalStepProps}
          variant="outlined"
          current={currentStep}
          status={stepStatus}
        />
      </Card>
    </Flex>
  );
}
