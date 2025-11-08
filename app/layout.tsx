import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { CartProvider } from "./contexts/CartContext"
import { ProductsBudgetProvider } from "./contexts/ProductsBudgetContext"
import { VehicleProvider } from "./contexts/VehicleContext"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

export const viewport = {
  themeColor: "#242424",
}

export const metadata: Metadata = {
  title: "Ancora Express",
  description: "Marketplace completo de peças automotivas do Ancora Express",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ancora Express",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Ancora Express",
    title: "Ancora Express",
    description: "Marketplace completo de peças automotivas do Ancora Express",
  },
  twitter: {
    card: "summary",
    title: "Ancora Express",
    description: "Marketplace completo de peças automotivas do Ancora Express",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ancora Express" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="msapplication-tap-highlight" content="no" />

        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#1a1a1a" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${manrope.variable} ${GeistSans.variable} font-sans antialiased`}
      >
        <CartProvider>
          <ProductsBudgetProvider>
            <VehicleProvider>
              {children}
            </VehicleProvider>
          </ProductsBudgetProvider>
        </CartProvider>
      </body>
    </html>
  )
}
