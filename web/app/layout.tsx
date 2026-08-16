import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aksam.uz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AKSAM - Lentalar, elastik tasmalar va yorliqlar | Namangan, O'zbekiston",
    template: "%s | AKSAM"
  },
  description:
    "AKSAM - 2020-yildan beri Namanganda lentalar, elastik tasmalar va brend yorliqlarini ishlab chiqaruvchi kompaniya.",
  icons: { icon: "/logo.png" },
  openGraph: {
    type: "website",
    siteName: "AKSAM",
    locale: "uz_UZ",
    images: [{ url: "/images/og-default.jpg", width: 1364, height: 1364, alt: "AKSAM" }]
  },
  twitter: { card: "summary_large_image" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
