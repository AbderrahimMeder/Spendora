import type { Metadata } from 'next';
import Providers from './provider';
import './globals.css'
import './app.css'
import { Suspense } from 'react';
import I18nProvider from '@/components/i18n/I18nProvider'; 
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
            <I18nProvider>
              {children}     
            </I18nProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
