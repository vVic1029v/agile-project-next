"use client";

import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  width?: string;
}


export default function Panel({ children, width = 'w-[100%]' }: PanelProps) {
  return (
    <section className={"overflow-visible h-full shrink-0 px-[1vw] snap-center transition-transform duration-500 ease-in-out flex justify-center " + (width)}>
      {children}
    </section>
  );
}
