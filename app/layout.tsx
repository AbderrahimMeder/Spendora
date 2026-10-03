import type { Metadata } from 'next';
import Providers from './provider';
import './globals.css'
import './app.css'
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'spendora',
  description: 'Personal finance management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
