import { request } from "@/utils/reqeust";
import { useState } from "react";

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
    <div>
      <input
        type="file"
        multiple
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={handleFilesChange}
      />
      <button
        onClick={uploadFiles}
        disabled={files.length === 0}>
        Upload
      </button>

      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Upload;
