// ui/src/components/FileDownload.tsx
"use client";

import React, { useState } from "react";
import { Download, X } from "lucide-react";

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({
  onDownload,
  isDownloading,
}: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    const portNum = parseInt(inviteCode.trim(), 10);
    if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
      setError("Please enter a valid port number (1-65535)");
      return;
    }
    try {
      await onDownload(portNum);
    } catch (err) {
      setError("Failed to download. Verify invite code and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Invite Code
        </label>
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter the 5-digit invite code"
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300"
          disabled={isDownloading}
          required
        />
        {error && (
          <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 flex items-center gap-2">
              <X size={16} className="text-red-500" /> {error}
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>Download File</span>
          </>
        )}
      </button>
    </form>
  );
}
