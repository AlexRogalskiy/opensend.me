import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { Dragger } = Upload;

  const props = {
    name: "file",
    multiple: false,
    customRequest({ file, onError, onSuccess, onProgress }) {
      setLoading(true);

      const filename = encodeURIComponent(file.name);
      fetch(`/api/upload?file=${filename}`)
        .then((res) => res.json())
        .then(async (res) => {
          const { url, fields, fileID } = await res;
          const formData = new FormData();

          Object.entries({ ...fields, file }).forEach(([key, value]) => {
            formData.append(key, value);
          });

          var options = {
            onUploadProgress: (event) => {
              const { loaded, total } = event;
              onProgress(
                {
                  percent: Math.round((loaded / total) * 100),
                },
                file
              );
            },
          };

          axios
            .post(url, formData, options)
            .then((result) => {
              setLoading(false);
              onSuccess(result, file);
              message.success("Successfully Upload!");
              alert(
                `Youre download URL is https://opensend.me/download/${fileID}`
              );
            })
            .catch((error) => {
              onError(error);
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600" href="https://github.com/Peppermint-Lab/opensend" target="_blank">
            opensend.me
          </a>
        </h1>

        <h2 className="text-2xl font-bold">
          Upload upto 10GB files with public links that last 24 hours!
        </h2>

        <p>All files are sent through the browser so speed will depend on your connection.</p>

        <div className="mt-4">
          <Dragger {...props} disabled={loading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </div>
      </main>
    </div>
  );
}
