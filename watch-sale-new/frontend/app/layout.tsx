import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ANIX Official | Luxury Timepiece Boutique",
  description: "Experience the pinnacle of luxury with ANIX Official's curated collection of masterwork timepieces in Sri Lanka.",
};

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatBot from "@/app/components/ChatBot";
import WhatsAppButton from "@/app/components/WhatsAppButton";
import Preloader from "@/app/components/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <Preloader />
        <GoogleOAuthProvider clientId={googleClientId}>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </GoogleOAuthProvider>
        
        {/* AI Chat Bot */}
        <ChatBot />

        {/* Floating WhatsApp Button */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
