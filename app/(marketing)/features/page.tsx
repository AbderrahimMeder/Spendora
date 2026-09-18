import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturesUI from '@/components/marketing/features-ui';

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Features Content */}
      <main style={{ flex: 1 }}>
        <FeaturesUI />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
