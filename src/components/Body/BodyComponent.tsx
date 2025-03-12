'use client';

import React from "react";
import { SessionProvider } from "next-auth/react";
import NavBar from "./NavBar";

const BodyComponent = ({children}: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/6">
        <NavBar />
      </div>
      <div className="w-5/6">
        <SessionProvider>
          {children}
        </SessionProvider>
      </div>
    </div>
  );
};
 
export default BodyComponent;