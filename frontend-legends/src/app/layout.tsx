import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legends Detailers | Premium PPF, Ceramic, Graphene & Detailing",
  description:
    "Premium automobile detailing website for PPF, ceramic coating, graphene coating, wash, dry clean, glass coating, and doorstep service. Follow @thelegenddetailers.",
  openGraph: {
    title: "Legends Detailers",
    description: "Premium automotive detailing, protection, and client-ready admin workflow.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
