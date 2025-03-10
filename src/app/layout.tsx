
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageBodyWrapper from "@/components/Body/PageBodyWrapper";
import ClientWrapper from "@/components/Body/ClientWrapper";
import { SessionProvider } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Calendar",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <SessionWrapper>
   <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ClientWrapper children={children}></ClientWrapper>
        </body>
      </html>
    </SessionWrapper>
   

  
  );
}
