import type { Metadata } from "next";
import { Bebas_Neue, Rajdhani } from "next/font/google";
import "./globals.css";

const headingFont = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

const bodyFont = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Legend Detailers | Premium PPF, Ceramic, Graphene & Detailing",
  description:
    "Immersive premium detailing website for The Legend Detailers. PPF, ceramic coating, graphene coating, wash, dry clean, glass coating, leather care, and doorstep service.",
  openGraph: {
    title: "The Legend Detailers",
    description: "Luxury automotive detailing, protection, and cinematic studio storytelling.",
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
        className={`${headingFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
