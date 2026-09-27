'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Wallet } from 'lucide-react';


export default function NotFound() {
  const router = useRouter()
  const code = '404'
  const message = ''
  const errors: Record<string, {
    title: string;
    message: string;
    button: string;
    action: () => void;
  }> = {
    '401': {
      title: "Session Expired",
      message: message||"Your session has expired. Please log in again.",
      button: "Go to Login",
      action:()=>{
        router.push('/login')
      }
    },

    '403': {
      title: "Access Denied",
      message: message||"You do not have permission to access this page.",
      button: "Go Back",
      action:()=>{
        router.back()
      }
    },

    '404': {
      title: "Page Not Found",
      message: message||"The page you are looking for does not exist.",
      button: "Go Home",
      action:()=>{
        router.push('/')
      }
    },

    '500': {
      title: "Server Error",
      message: message || "Something went wrong on our server.",
      button: "Try Again",
      action:()=>{
        window.location.reload()
      }
    },
  };

  const error = errors[code] || errors['404'];

  return (  
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#111111',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            marginBottom: '2rem',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
          }}>
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
           Fin<span style={{ color: '#10b981' }}>ore</span> 
          </span>
        </Link>

        {/* 404 Large Glow Badge */}
        <div style={{
          fontSize: 'clamp(4.5rem, 10vw, 6rem)',
          fontWeight: '900',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: '#10b981',
          marginBottom: '1rem',
          textShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
        }}>
          {code}
        </div>

        {/* Title & Description */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '0.65rem',
        }}>
          {error.title}
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          maxWidth: '380px',
          margin: '0 auto 2rem auto',
        }}>
          {error.message}
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => error.action()}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <ArrowLeft size={16} />
            <span>{error.button}</span>
          </button>

          <Link
            href="/dashboard"
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem', textDecoration: 'none' }}
          >
            <Home size={16} />
            <span>Back to dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
