import React from 'react';
import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import FeaturesUI from '@/components/marketing/features-ui';

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>

      {/* Main Features Content */}
      <main style={{ flex: 1 }}>
        <FeaturesUI />
      </main>
    </div>
  );
}
