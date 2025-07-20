import type { Metadata } from "next";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { trackWebVitals } from "@/lib/analytics";
import "./globals.css";

if (typeof window !== 'undefined') {
  trackWebVitals();
}

export const metadata: Metadata = {
  title: "MenuMind",
  description: "AI 기반 개인화된 음식 메뉴 추천 - MenuMind",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MenuMind",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FF8500',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" href="/icon-180x180.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/icon-152x152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/icon-120x120.png" sizes="120x120" />
        <link rel="apple-touch-icon" href="/icon-76x76.png" sizes="76x76" />
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-system antialiased">
        <a href="#main-content" className="skip-link">
          메인 콘텐츠로 건너뛰기
        </a>
        <ToastProvider>
          <OfflineIndicator />
          <div className="content-layer">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
