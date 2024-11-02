import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html>
        <body>
          <Header />
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </AuthProvider>
  );
}
