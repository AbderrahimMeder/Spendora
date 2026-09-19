import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';
import { CURRENCIES } from '@/utils/dashboardUtils';
import { getCategoryDetails } from '@/utils/dashboardUtils';
import {toast} from 'sonner';
import { Budget } from '@/types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget?: Budget;
  currency?: string;
  onSave: (budget: Budget) => void;
}

export default function BudgetModal({
  isOpen,
  onClose,
  currentBudget = { totalBudget: 4500, categoryBudgets: {} },
  currency = 'USD',
  onSave
}: BudgetModalProps) {
  if (!isOpen) return null;

  const [totalBudget, setTotalBudget] = useState(currentBudget.totalBudget || 4500);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    'cat-food': currentBudget.categoryBudgets?.['cat-food'] || 600,
    'cat-housing': currentBudget.categoryBudgets?.['cat-housing'] || 1200,
    'cat-transport': currentBudget.categoryBudgets?.['cat-transport'] || 350,
    'cat-shopping': currentBudget.categoryBudgets?.['cat-shopping'] || 400,
    'cat-entertainment': currentBudget.categoryBudgets?.['cat-entertainment'] || 250,
    'cat-utilities': currentBudget.categoryBudgets?.['cat-utilities'] || 300,
    'cat-health': currentBudget.categoryBudgets?.['cat-health'] || 200,
    'cat-other-exp': currentBudget.categoryBudgets?.['cat-other-exp'] || 200,
  });

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  const handleCategoryBudgetChange = (catId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setCategoryBudgets(prev => ({
      ...prev,
      [catId]: num
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTotal = Number(totalBudget);
    if (isNaN(numTotal) || numTotal <= 0) {
      toast.error('Please enter a valid total monthly budget');
      return;
    }

    onSave({
      totalBudget: numTotal,
      categoryBudgets
    });

    toast.success('Budget settings updated successfully!');
    onClose();
  };

  const categories = Object.keys(categoryBudgets);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Target size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Adjust Monthly Budget
              </h3>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
                Set overall spend ceiling and individual category limits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-icon"
            style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Total Budget Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Total Monthly Limit ({currencyObj.symbol})</label>
              <input
                type="number"
                step="50"
                min="100"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="form-input"
                style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-primary)' }}
              />
            </div>

            {/* Category Budgets Divider */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                Category Ceilings
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                maxHeight: '220px',
                overflowY: 'auto',
                paddingRight: '0.25rem',
              }}>
                {categories.map((catKey) => {
                  const details = getCategoryDetails(catKey);
                  return (
                    <div
                      key={catKey}
                      style={{
                        padding: '0.65rem',
                        background: '#0d0d0d',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: details.color,
                        marginBottom: '0.3rem',
                      }}>
                        {details.name}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          step="25"
                          min="0"
                          value={categoryBudgets[catKey]}
                          onChange={(e) => handleCategoryBudgetChange(catKey, e.target.value)}
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Check size={16} />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
