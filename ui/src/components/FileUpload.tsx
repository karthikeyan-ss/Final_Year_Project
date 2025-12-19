// ui/src/components/FileUpload.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Upload, Check } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({
  onFileUpload,
  isUploading,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if ((e.dataTransfer as DataTransfer).files?.[0]) {
        const file = (e.dataTransfer as DataTransfer).files[0];
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative transition-all duration-300 ${
          dragActive ? "scale-105" : ""
        }`}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <label
          htmlFor="fileInput"
          className={`block w-full p-12 border-3 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300
            ${
              dragActive
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl">
                <Upload size={48} className="text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                +
              </div>
            </div>

            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">
                Drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Support for PDFs, documents, images, and more
              </p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
