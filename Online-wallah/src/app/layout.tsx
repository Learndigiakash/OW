import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PublicLayoutShell from "@/components/public/PublicLayoutShell";

export const viewport: Viewport = {
  themeColor: "#0A2A66",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | OnlineWallah.com",
    default: "OnlineWallah.com — India's Trusted Sarkari Job & Exam Results Portal",
  },
  description:
    "OnlineWallah is India's premier aggregator for Latest Sarkari Jobs, Results, Admit Cards, Answer Keys, Syllabus, and Admissions for UPSC, SSC, Railway, Banking, Police & State PSCs.",
  keywords: [
    "Sarkari Result",
    "Latest Jobs",
    "Admit Card 2026",
    "Answer Key",
    "UPSC",
    "SSC CGL",
    "Railway RRB",
    "Syllabus",
    "Govt Jobs India",
  ],
  authors: [{ name: "OnlineWallah Editorial Team" }],
  creator: "OnlineWallah.com",
  publisher: "OnlineWallah",
  metadataBase: new URL("https://onlinewallah.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://onlinewallah.com",
    siteName: "OnlineWallah",
    title: "OnlineWallah.com — India's Trusted Sarkari Job & Exam Results Portal",
    description:
      "Get real-time updates on Latest Sarkari Jobs, Results, Admit Cards, Syllabus, and Admissions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlineWallah.com — Sarkari Job Portal",
    description: "Fastest government recruitment and exam updates in India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <PublicLayoutShell>{children}</PublicLayoutShell>
      </body>
    </html>
  );
}
