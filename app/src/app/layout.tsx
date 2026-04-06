import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Legends Ops",
  description: "Internal owner and employee app for customer intake, repeat-customer autofill, and live job tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
