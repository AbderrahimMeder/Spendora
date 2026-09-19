import React from 'react';
import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import { AboutUs } from '@/components/marketing/about-ui';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Marketing Content */}
      <main style={{ flex: 1 }}>
        <AboutUs />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
