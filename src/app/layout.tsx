import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gigantera.xyz/bora"),
  title: "Bora 13 — Conversas que Importam | Guia Oficial de Diálogo",
  description: "Encontre os melhores argumentos baseados em dados reais para dialogar com respeito e eficácia sobre o futuro do Brasil. Ferramenta gratuita, anônima e sem cadastro.",
  keywords: ["eleições 2026", "argumentos", "dados", "diálogo", "Brasil", "conversa", "economia", "fatos verificados", "Casa 13"],
  authors: [{ name: "Casa 13 / Bora" }],
  applicationName: "Bora 13",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bora 13",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Bora 13 — Conversas que Importam",
    description: "Argumentos baseados em dados reais para conversas que mudam o Brasil.",
    type: "website",
    locale: "pt_BR",
    siteName: "Bora 13",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Bora 13 — Conversas que Importam",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Bora 13 — Conversas que Importam",
    description: "Argumentos baseados em dados reais para dialogar com quem pensa diferente.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C52229",
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
        {/* Ribbon Oficial Multicolorida Casa 13 */}
        <div className="casa-ribbon" />

        <SmoothScroll>
          <main className="flex-1 w-full relative">
            {children}
          </main>
        </SmoothScroll>

        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration skipped:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
