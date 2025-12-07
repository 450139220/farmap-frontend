import { useState } from "react";
import {
  Upload as UploadAntd,
  Flex,
  Image,
  Button,
  type UploadFile,
  type UploadProps,
  type StepsProps,
} from "antd";
import COS from "cos-js-sdk-v5";

import { permanence } from "@/utils/permanence";
import { req } from "@/utils/reqeust";
import {
  CloudSyncOutlined,
  PaperClipOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
  onProgress: (currProgress: number, status: StepsProps["status"]) => void;
  onFinish: (res: string, type: "normal" | "error") => void;
}
export default function Upload(props: Props) {
  // Constants
  const FILE_TYPES = ["image/png", "image/jpeg"];
  const FILE_SIZE = 10 * 1024 * 1024;

  // Preview Image
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const handlePreview = async (file: UploadFile) => {
    const blob = new Blob([file as unknown as File], { type: file.type });
    if (!file.url && !file.preview) {
      file.preview = await getBase64(blob as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Files list
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    const files = newList
      .map((f) => f.originFileObj)
      .filter(
        (f) => f && FILE_TYPES.includes(f.type) && f.size < FILE_SIZE,
      ) as UploadFile[];
    // console.log(files[0] instanceof File);
    setFileList((prev) => [...new Set(prev.concat(files))]);
  };
  const removeFile = (target: UploadFile) => {
    setFileList((prev) => prev.filter((f) => f !== target));
  };

  // Upload and run ai
  const [isDisabled, setIsDisabled] = useState(false);
  const uploadFiles = () => {
    if (fileList.length === 0) return;

    const cosFiles: COS.UploadFileParams[] = (
      fileList as unknown as File[]
    ).map((f) => ({
      Bucket: "halo-prod-1317766785",
      Region: "ap-chongqing",
      Key: `/farmap/usercall-${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}${new Date().getHours()}-${f.name}`,
      Body: f,
    }));

    try {
      navigator.geolocation.getCurrentPosition(
        async () => {
          // const { latitude, longitude } = position.coords;
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
            onFileFinish: (err, data) => {
              ossResult.push("https://" + data.Location);
              setFileList([]);
              if (err) {
                props.onProgress(1, "error");
                throw err;
              }
              props.onProgress(2, "process");
            },
          });
          // Upload to ai for analyzing
          try {
            const aiResp = await req.post<
              { imageUrls: string[] },
              LLModelResponse
            >(
              "/ai-model/analyze",
              {
                // imageUrls: ossResult,
                imageUrls: [
                  "https://halo-prod-1317766785.cos.ap-chongqing.myqcloud.com/farmap/1.jpg",
                ],
              },
              {
                Authorization: `Bearer ${token}`,
                "X-Api-Key":
                  "sk-Hjh9EBFtQ64WK9niBxBBknJkosxMKLFEdvlVXXaIAqCxVxWI",
              },
            );
            console.log(aiResp);
            if (!aiResp.data) {
              props.onProgress(2, "error");
              props.onFinish(aiResp.msg!, "error");
              throw new Error("请求失败");
            }
            props.onProgress(3, "process");
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

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        建议上传 3-5 张作物照片，且大小不超过 10MB 每张。
        <span style={{ color: "var(--warning)" }}>
          超出限制的图片将会被丢弃。
        </span>
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
              <CloudSyncOutlined
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
    </>
  );
}
