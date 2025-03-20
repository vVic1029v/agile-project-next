"use client";

import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  width?: string;
}

export default function Panel({ children, width }: PanelProps) {
  return (
    <section className={"overflow-y-hidden h-full shrink-0 px-[1vw] snap-center transition-transform duration-500 ease-in-out " + (width ? ` ${width}` : 'w-[80%]')}>
      {children}
    </section>
  );
}
