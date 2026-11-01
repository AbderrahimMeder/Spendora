import React from 'react';
import ReportsUI from '@/components/marketing/reports-ui';

export default function ReportsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Main Reports Content */}
      <main style={{ flex: 1 }}>
        <ReportsUI />
      </main>
    </div>
  );
}
