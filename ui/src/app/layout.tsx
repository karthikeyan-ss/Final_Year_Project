// ui/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PeerLink - P2P File Sharing",
  description: "Secure Peer-to-Peer file sharing with premium UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <main className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-5xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
