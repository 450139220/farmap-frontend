import { req } from "@/utils/reqeust";
import { useState } from "react";

import { Button, Card, Image, Upload as UploadAntd, type UploadFile } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

export const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function Upload() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const FILE_TYPES = ["image/png", "image/jpeg"];
  const FILE_SIZE = 10 * 1024 * 1024;

  const handleChange = (info: any) => {
    const { fileList } = info;
    // 过滤符合条件的文件
    const validFiles = fileList
      .map((f: UploadFile) => f.originFileObj as File)
      .filter((file: File) => file && FILE_TYPES.includes(file.type) && file.size <= FILE_SIZE)
      .slice(0, 5);
    setFiles(validFiles);
  };

  const uploadFiles = () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          // TODO: upload file to OSS
          // const res = await req.post<any>("/", formData);
          // TODO: upload to LLM
          // console.log(res);
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
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </button>
  );

  return (
    <Card
      title={
        <>
          <UploadOutlined />
          &nbsp;&nbsp;上传作物
        </>
      }
      style={{ flexGrow: 0 }}>
      <div style={{ marginBottom: "1rem" }}>
        建议上传 3-5 张作物照片，且大小不超过 10MB 每张。
        <span style={{ color: "var(--warning)" }}>超出限制的图片将会被丢弃。</span>
      </div>
      <UploadAntd
        listType="picture-card"
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
        multiple>
        {files.length >= 5 ? null : uploadButton}
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
        disabled={files.length === 0}>
        上传作物并处理
      </Button>
    </Card>
  );
}

export default Upload;
