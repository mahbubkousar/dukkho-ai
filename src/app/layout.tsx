import type { Metadata } from "next";
import { hindSiliguri, galada, notoSerifBengali } from "@/lib/fonts";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Configure Font Awesome core
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "দুঃখ এআই",
  description: "A satirical Bengali AI chatbot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} ${galada.variable} ${notoSerifBengali.variable} font-body antialiased font-medium`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
