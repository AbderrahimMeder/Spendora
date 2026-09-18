import type { Metadata } from 'next';
import Providers from './provider';
import './globals.css'
import './app.css'
export const metadata: Metadata = {
  title: 'Finora',
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}