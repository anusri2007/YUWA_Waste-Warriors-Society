import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Image, Video, X, FileCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const FileUploader = ({ files = [], setFiles, maxFiles = 6 }) => {
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rej) => {
          const errorMsg = rej.errors[0]?.message || "Invalid file format or size";
          toast.error(`${rej.file.name}: ${errorMsg}`);
        });
      }

      if (acceptedFiles.length + files.length > maxFiles) {
        toast.error(`You can upload a maximum of ${maxFiles} evidence files.`);
        return;
      }

      const newUploadedFiles = acceptedFiles.map((file) => {
        const isVideo = file.type.startsWith("video/");
        const previewUrl = URL.createObjectURL(file);

        // Simulate upload progress
        setUploadProgress((prev) => ({ ...prev, [file.name]: 35 }));
        setTimeout(() => {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
        }, 600);

        return {
          id: `${file.name}-${Date.now()}`,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          type: file.type,
          isVideo,
          previewUrl,
          fileRef: file
        };
      });

      setFiles((prev) => [...prev, ...newUploadedFiles]);
      toast.success(`${acceptedFiles.length} file(s) staged for evidence.`);
    },
    [files, maxFiles, setFiles]
  );

  const removeFile = (id, name) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success(`Removed ${name}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/webm": [".webm"]
    },
    maxSize: MAX_FILE_SIZE,
    disabled: files.length >= maxFiles
  });

  return (
    <div className="file-uploader-container">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`eco-dropzone-box ${isDragActive ? "dropzone-active" : ""} ${
          files.length >= maxFiles ? "dropzone-disabled" : ""
        }`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-inner-content">
          <div className="dropzone-icon-bubble">
            <UploadCloud size={32} className="text-emerald-600" />
          </div>

          <div className="dropzone-text-group">
            <h4 className="dropzone-heading">
              {isDragActive
                ? "Drop the evidence files here..."
                : "Drag & drop photos or videos, or browse"}
            </h4>
            <p className="dropzone-sub">
              Photos: JPG, PNG, WEBP • Videos: MP4, MOV, WEBM (Max 50MB each)
            </p>
          </div>

          <span className="dropzone-btn-browse">Browse Device</span>
        </div>
      </div>

      {/* File Previews List */}
      {files.length > 0 && (
        <div className="staged-files-list">
          <div className="staged-files-header">
            <span className="font-semibold text-sm">
              Staged Evidence ({files.length}/{maxFiles})
            </span>
            <span className="text-xs text-muted">Ready for evaluation submission</span>
          </div>

          <div className="staged-previews-grid">
            {files.map((file) => {
              const progress = uploadProgress[file.name] || 100;

              return (
                <div key={file.id} className="staged-file-card">
                  <div className="preview-media-box">
                    {file.isVideo ? (
                      <div className="video-thumb-placeholder">
                        <Video size={28} className="text-emerald-500" />
                        <span className="video-thumb-label">Video Clip</span>
                      </div>
                    ) : (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        className="preview-img"
                      />
                    )}

                    <button
                      type="button"
                      className="btn-remove-staged"
                      onClick={() => removeFile(file.id, file.name)}
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="staged-file-info">
                    <span className="staged-file-name" title={file.name}>
                      {file.name}
                    </span>
                    <div className="staged-meta-row">
                      <span className="staged-file-size">{file.size}</span>
                      {progress < 100 ? (
                        <span className="text-xs text-amber-500">Processing...</span>
                      ) : (
                        <span className="staged-valid-tag">
                          <FileCheck size={11} /> Validated
                        </span>
                      )}
                    </div>

                    {progress < 100 && (
                      <div className="mini-upload-bar-track">
                        <div
                          className="mini-upload-bar-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
