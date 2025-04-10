
import type { Metadata } from "next";
import { Geist, Geist_Mono, } from "next/font/google";
import { IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

import '@fortawesome/fontawesome-free/css/all.min.css';
import ClientWrapper from "@/components/body/ClientWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrontYard",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <SessionWrapper>
   <html lang="en">
        <body className={` ${ibmPlexSerif.variable} antialiased`}>
            <ClientWrapper>
              {children}
            </ClientWrapper>
        </body>
      </html>
    </SessionWrapper>
   

  
  );
}
