import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import MarketingLayoutWrapper from "@/components/marketing/MarketingLayoutWrapper";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "LibraryOS — Manage Your Reading Library Effortlessly",
  description: "The complete PWA management system for Indian study rooms and reading libraries. Manage seats, fees, and shifts from your phone.",
  verification: {
    google: "Dn0o-uDMjrhnziTS3ZmH9qcNb38uAvBEgkfzQ9vFWjw",
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
        className={`${dmSans.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gray-50 text-gray-800 flex flex-col min-h-screen`}
      >
        <MarketingLayoutWrapper>
          {children}
        </MarketingLayoutWrapper>
      </body>
    </html>
  );
}
