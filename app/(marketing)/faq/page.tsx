import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import FaqUI from '@/components/marketing/faq-ui';

export default function FaqPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <FaqUI />
      </main>
      <Footer />
    </div>
  );
}
