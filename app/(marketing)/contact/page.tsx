
import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import ContactUI from '@/components/marketing/contact-ui';

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ContactUI />
      </main>
      <Footer />
    </div>
  );
}
