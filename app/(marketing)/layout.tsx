import Footer from '@/components/marketing/home/Footer';
import Navbar from '@/components/marketing/home/Navbar';
import { getCurrentUser } from '@/lib/CurrentUser';
import type { Metadata } from 'next';
import { User } from '@/types';
export const metadata: Metadata = {
  title: 'Finora',
  description: 'Personal finance management',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user }: User = await getCurrentUser()
  return (
    <body>
      <Navbar user={user} />
      {children}
      <Footer />
    </body>
  );
}