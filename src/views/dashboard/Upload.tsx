import { request } from "@/utils/reqeust";
import { useRef, useState } from "react";
import style from "./index.module.css";

function Upload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    // validate file type and size
    const FILE_TYPES = ["image/png", "image/jpeg"];
    const FILE_SIZE = 6 * 1024 * 1024;
    const validFiles = selectedFiles.filter(
      (file) => FILE_TYPES.includes(file.type) && file.size <= FILE_SIZE,
    );
    setFiles(files.concat(validFiles));
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleSelectFiles = (): void => {
    fileInputRef.current?.click();
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
          // TODO: upload file here
          const res = await request.post<any>("/", formData);
          console.log(res);
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
    <div className={`box ${style.upload__container}`}>
      <div style={{ color: "var(--light-font)", marginBottom: "1rem" }}>
        建议上传 3-5 张图片，且每张图片大小不要超过{" "}
        <span style={{ color: "var(--warning)" }}>5MB</span>。
      </div>
      <input
        style={{ display: "none" }}
        ref={fileInputRef}
        type="file"
        multiple
        accept=".png,.jpg,.jpeg"
        onChange={handleFilesChange}
      />
      <div className={style.button__container}>
        <button
          className={style.select__button}
          onClick={handleSelectFiles}>
          选择文件
        </button>
        <button
          className={style.upload__button}
          onClick={uploadFiles}
          disabled={files.length === 0}>
          上传文件并处理
        </button>
      </div>

      {/* 图片预览 */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
        {files.map((file) => (
          <img
            key={file.name}
            src={URL.createObjectURL(file)}
            alt={file.name}
            onClick={() => {
              setFiles(files.filter((f) => f !== file));
            }}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
        ))}
      </div>
      {files.length !== 0 && (
        <div style={{ color: "var(--light-font)", fontSize: "0.8rem", marginTop: "1rem" }}>
          点击图片以删除。
        </div>
      )}
    </div>
  );
}

export default Upload;
