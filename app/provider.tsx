'use client';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/hooks/auth';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <AuthProvider>
      {children}
      <Toaster theme='dark' position='top-right' richColors/>
    </AuthProvider>
    </>
  );
}