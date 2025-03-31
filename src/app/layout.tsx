
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
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-30 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          
        </div>
      </div>
    </header>
            <ClientWrapper>
              {children}
            </ClientWrapper>
        </body>
      </html>
    </SessionWrapper>
   

  
  );
}
