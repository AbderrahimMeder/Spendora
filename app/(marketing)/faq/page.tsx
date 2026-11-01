import React from 'react';
import FaqUI from '@/components/marketing/faq-ui';

export default function FaqPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <main style={{ flex: 1 }}>
        <FaqUI />
      </main>
    </div>
  );
}
