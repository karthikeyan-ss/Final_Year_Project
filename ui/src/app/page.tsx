// ui/src/app/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import FileUpload from "@/components/FileUpload";
import FileDownload from "@/components/FileDownload";
import InviteCode from "@/components/InviteCode";
import { Upload, Download } from "lucide-react";

export default function Page() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "download">("upload");

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // keep original backend API endpoint
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.port) {
        setPort(response.data.port);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (portNum: number) => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`/api/download/${portNum}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // try to compute filename
      let filename = "downloaded-file";
      const headerKey = Object.keys(response.headers || {}).find(
        (k) => k.toLowerCase() === "content-disposition"
      );
      if (headerKey) {
        const m = (response.headers as any)[headerKey].match(/filename="(.+)"/);
        if (m) filename = m[1];
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Check invite code.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {/* Background animated blobs (kept from friend) */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"
          style={{ animationDelay: "1.8s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"
          style={{ animationDelay: "3.6s" }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <header className="text-center mb-14 animate-fade">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform rotate-12">
                  <Upload
                    className="text-white"
                    size={22}
                    style={{ transform: "rotate(-12deg)" }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PeerLink
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Secure Peer-to-Peer File Sharing
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Share files instantly, securely, and seamlessly
          </p>
        </header>

        <div className="card-premium overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-8 py-6 font-semibold text-lg ${
                activeTab === "upload"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Upload size={20} />
                <span>Share a File</span>
              </div>
              {activeTab === "upload" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("download")}
              className={`flex-1 px-8 py-6 font-semibold text-lg ${
                activeTab === "download"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Download size={20} />
                <span>Receive a File</span>
              </div>
              {activeTab === "download" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-full" />
              )}
            </button>
          </div>

          <div className="p-8">
            {activeTab === "upload" ? (
              <>
                <FileUpload
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />

                {uploadedFile && !isUploading && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 mt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                          {/* small check icon */}
                          <svg
                            className="w-5 h-5 text-green-600"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Selected file:
                          </p>
                          <p className="font-semibold text-gray-800">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(uploadedFile.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setPort(null);
                        }}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="text-center py-8 animate-fade">
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">
                          Uploading your file...
                        </p>
                        <p className="text-sm text-gray-600">
                          Please wait a moment
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {port && !isUploading && <InviteCode port={port} />}
              </>
            ) : (
              <>
                <FileDownload
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
              🔒
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Secure Transfer
            </h3>
            <p className="text-sm text-gray-600">
              End-to-end encryption ensures your files stay private
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
              ⚡
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">
              Direct peer-to-peer connection for maximum speed
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
              🌐
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">No Limits</h3>
            <p className="text-sm text-gray-600">
              Share files of any size without restrictions
            </p>
          </div>
        </div>

        <footer className="mt-16 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <p className="text-gray-600 font-medium">
              PeerLink © {new Date().getFullYear()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Secure P2P File Sharing
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .animate-pulse-soft {
          animation: pulse-soft 4s ease-in-out infinite;
        }
        @keyframes pulse-soft {
          0% {
            transform: scale(1);
            opacity: 0.28;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.36;
          }
          100% {
            transform: scale(1);
            opacity: 0.28;
          }
        }
      `}</style>
    </div>
  );
}
