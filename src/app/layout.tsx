import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gigantera.xyz/bora"),
  title: "Bora — Conversas que Importam | Argumentos Baseados em Fatos",
  description: "Encontre os melhores argumentos baseados em dados reais para dialogar com respeito e eficácia sobre o futuro do Brasil. Ferramenta gratuita, anônima e sem cadastro.",
  keywords: ["eleições 2026", "argumentos", "dados", "diálogo", "Brasil", "conversa", "economia", "fatos verificados"],
  authors: [{ name: "Bora App" }],
  applicationName: "Bora",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bora",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Bora — Conversas que Importam",
    description: "Argumentos baseados em dados reais para conversas que podem mudar o Brasil.",
    type: "website",
    locale: "pt_BR",
    siteName: "Bora",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Bora App — Conversas que Importam",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Bora — Conversas que Importam",
    description: "Encontre os melhores argumentos baseados em dados reais para dialogar com qualquer pessoa.",
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
  themeColor: "#080F1A",
};

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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gradient-animated antialiased">
        {/* Decorative ambient orbs */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        <main className="relative z-10">
          {children}
        </main>

        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration skipped or failed:', err);
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
