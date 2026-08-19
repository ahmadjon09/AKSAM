// Root layout: the storefront chrome (header/footer/providers) is attached
// here - outside [lang] - so it never remounts on navigation or language
// change. Only locale-prefixed routes get the chrome; /admin stays clean.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StorefrontChrome } from "@/components/providers/StorefrontChrome";
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
    default:
      "AKSAM - Lentalar, elastik tasmalar va yorliqlar | Namangan, O'zbekiston",
    template: "%s | AKSAM"
  },

  description:
    "AKSAM - 1991-yildan beri Namanganda lentalar, elastik tasmalar, kiyim yorliqlari va brend etiketkalarini ishlab chiqaruvchi kompaniya. Sifatli lenta, rezina tasma va maxsus yorliqlar ishlab chiqarish.",

  keywords: [
    "AKSAM",
    "AKSAM Namangan",
    "lenta ishlab chiqarish",
    "lentalar",
    "elastik lenta",
    "elastik tasma",
    "rezina tasma",
    "etiketka",
    "etiketkalar",
    "yorliq",
    "yorliqlar",
    "kiyim yorlig'i",
    "kiyim etiketkasi",
    "brend yorliqlari",
    "brend etiketkalari",
    "to'qima yorliq",
    "to'qilgan etiketka",
    "woven label",
    "woven labels",
    "clothing labels",
    "brand labels",
    "custom labels",
    "tekstil yorliqlari",
    "tekstil etiketkalari",
    "Namangan lenta",
    "Namangan etiketka",
    "Namangan yorliq",
    "O'zbekistonda etiketka ishlab chiqarish",
    "O'zbekistonda lenta ishlab chiqarish",
    "etiketka ishlab chiqarish",
    "yorliq ishlab chiqarish",
    "tekstil mahsulotlari",
    "tekstil aksessuarlari"
  ],

  authors: [{ name: "AKSAM" }],
  creator: "AKSAM",
  publisher: "AKSAM",

  icons: {
    icon: "/logo.png"
  },

  openGraph: {
    type: "website",
    siteName: "AKSAM",
    locale: "uz_UZ",
    title:
      "AKSAM - Lentalar, elastik tasmalar va brend etiketkalari",
    description:
      "Lentalar, elastik tasmalar, kiyim yorliqlari va brend etiketkalarini ishlab chiqarish. AKSAM — Namangan, O'zbekiston.",
    url: siteUrl,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1364,
        height: 1364,
        alt: "AKSAM - Lentalar, elastik tasmalar va brend etiketkalari"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title:
      "AKSAM - Lentalar, elastik tasmalar va brend etiketkalari",
    description:
      "Namanganda lentalar, elastik tasmalar va brend etiketkalarini ishlab chiqarish.",
    images: ["/images/og-default.jpg"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}