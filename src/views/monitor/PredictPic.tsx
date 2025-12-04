import { PaperClipOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Image, Upload, type UploadFile, type UploadProps } from "antd";
import { useState } from "react";
import { getBase64 } from "../model/Upload";

const FILE_TYPES = ["image/png", "image/jpeg"];

export default function PredictPic() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps["onChange"] = ({ fileList: newList }) => {
    const files = newList
      .map((f) => f.originFileObj)
      .filter((f) => f && FILE_TYPES.includes(f.type)) as UploadFile[];
    // console.log(files[0] instanceof File);
    setFileList((prev) => prev.concat(files));
  };

  // Upload pictures to server to predict
  const handlePredictPic = async () => {
    // TODO: send files to server
    setFileList([]);
  };
  // Open a image file to preview
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

  // Prediction result displays
  const [prediction, setPrediction] = useState<string>("");
  return (
    <>
      <Upload
        listType="picture"
        multiple
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        beforeUpload={() => false}
        itemRender={(_, file) => {
          return (
            <div
              onClick={() => {
                handlePreview(file);
              }}>
              <PaperClipOutlined />
              &nbsp;&nbsp;
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}>
                {file.name}
              </span>
            </div>
          );
        }}
        style={{ width: "100%" }}>
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
      </Upload>
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handlePredictPic}
        style={{ width: "100%", marginTop: "1rem" }}>
        开始推理
      </Button>

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

      <Divider />

      <div>
        <h4 style={{ padding: 0, margin: 0 }}>推理结果</h4>
        <p>{prediction}</p>
      </div>
    </>
  );
}
