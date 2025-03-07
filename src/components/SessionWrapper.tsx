// app/components/SessionWrapper.tsx
'use client'; // Asigură-te că este tratată ca o componentă de client

import { SessionProvider } from 'next-auth/react';

const SessionWrapper = ({ children } : { children: React.ReactNode}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionWrapper;
