import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patriaamada.lat"),
  title: "Bora 13 — Conversas que Importam | Guia Cidadão de Diálogo",
  description: "Iniciativa cidadã e voluntária criada para ajudar e somar na causa: roteiros de diálogo acolhedor, dados públicos auditados do seu estado e mensagens para WhatsApp. Ferramenta independente, sem vínculo institucional oficial com o PT ou Casa 13.",
  keywords: ["eleições 2026", "argumentos", "dados públicos", "diálogo cidadão", "Brasil", "conversa", "economia", "fatos verificados", "iniciativa voluntária", "Bora 13", "pátria amada"],
  authors: [{ name: "Iniciativa Cidadã Bora 13" }],
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
    title: "Bora 13 — Conversas que Importam | Guia Cidadão",
    description: "Iniciativa cidadã e independente: argumentos baseados em dados públicos auditados para conversas que somam no Brasil.",
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]"
      >
        {/* Ribbon Multicolorida Bora 13 */}
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
