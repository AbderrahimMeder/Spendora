
import Link from 'next/link';
import {Plus} from 'lucide-react';
import type { payment_methods } from '@/types';
import {TablePaymentMethod} from "@/components/admin/payment-method/table-payment-method";
export function PaymentMethod({payment_methods,token}: {
    payment_methods:payment_methods[],
    token?:string|null
}) {
    return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Transactions
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: '700',
                }}
              >
                {payment_methods.length} Records
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Real-time audit log of inflows, expense vouchers, category classification, and statements.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/payment-method/new"
              className="btn btn-primary"
              style={{
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                boxShadow: 'var(--accent-glow)',
              }}
            >
              <Plus size={16} />
              <span>Create Payment Method</span>
            </Link>
          </div>
        </div>
    </div>
    <TablePaymentMethod token={token}/>
    </>
    );
}