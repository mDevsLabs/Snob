export const dynamic = "force-dynamic";
import "./globals.css";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Snob - Édition Prestige",
  description: "Un jeu de blocs de prestige ultra-fluide avec mode campagne, blitz frénétique, quêtes quotidiennes et boutique de skins légendaires !",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#020617",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Snob",
  },
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
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
