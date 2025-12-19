// ui/src/components/InviteCode.tsx
"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface InviteCodeProps {
  port: number | null;
}

export default function InviteCode({ port }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);
  if (!port) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(port));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-fade">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="text-white" size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-900">
            File Ready to Share!
          </h3>
          <p className="text-sm text-green-700">
            Share this code with your recipient
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 bg-white p-5 rounded-xl border-2 border-green-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium mb-1">INVITE CODE</p>
          <p className="font-mono text-3xl font-bold text-gray-800 tracking-wider">
            {port}
          </p>
        </div>

        <button
          onClick={copyToClipboard}
          className={`p-5 ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          } rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>

      <div className="mt-4 p-4 bg-white/50 rounded-xl">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          This code is valid as long as your session is active
        </p>
      </div>
    </div>
  );
}
