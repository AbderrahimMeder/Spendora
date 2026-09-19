import React from 'react';
import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import ReportsUI from '@/components/marketing/reports-ui';

export default function ReportsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Reports Content */}
      <main style={{ flex: 1 }}>
        <ReportsUI />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
