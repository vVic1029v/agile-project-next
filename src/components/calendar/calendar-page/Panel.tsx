"use client";

import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

export default function Panel({ children }: PanelProps) {
  return (
    <section className="h-full w-[80%] shrink-0 snap-center p-8 transition-transform duration-500 ease-in-out">
      {children}
    </section>
  );
}
