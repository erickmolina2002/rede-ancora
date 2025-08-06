import type { Metadata } from "next";
import { Manrope, Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./contexts/CartContext";
import { ProductsBudgetProvider } from "./contexts/ProductsBudgetContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#242424",
};

export const metadata: Metadata = {
  title: "Rede Âncora",
  description: "Aplicativo de gestão de orçamento da Rede Âncora",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rede Âncora",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Rede Âncora",
    title: "Rede Âncora",
    description: "Aplicativo de gestão de orçamento da Rede Âncora",
  },
  twitter: {
    card: "summary",
    title: "Rede Âncora",
    description: "Aplicativo de gestão de orçamento da Rede Âncora",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rede Âncora" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#242424" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="mask-icon" href="/icon-192x192.png" color="#242424" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${manrope.variable} ${geist.variable} font-sans antialiased`}
      >
        <CartProvider>
          <ProductsBudgetProvider>
            {children}
          </ProductsBudgetProvider>
        </CartProvider>
      </body>
    </html>
  );
}
