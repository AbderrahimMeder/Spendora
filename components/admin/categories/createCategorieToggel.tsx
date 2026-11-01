'use client';

import React, { useState, useEffect } from 'react';
import { getCategoryIconComponent, ICON_OPTIONS, COLOR_OPTIONS } from '@/utils/iconComponent';
import { Tag, X, ArrowDownRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export function CreateToggle({
  token,
  mode,
}: {
  mode: 'edit' | 'create';
  token: string;
}) {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(mode === 'edit');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    type: 'EXPENSE',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    max_budget: 0,
  });

  useEffect(() => {
    let isMounted = true;
    if (mode === 'edit' && id) {
      const fetchCategoryDetails = async (categoryId: string) => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL!;
          const res = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (isMounted && data.status && data.category) {
            setFormData({
              name: data.category.name || '',
              slug: data.category.slug || '',
              icon: data.category.category_image || '',
              type: data.category.type || 'EXPENSE',
              color: data.category.category_color || '#10b981',
              bg: data.category.category_color || 'rgba(16, 185, 129, 0.12)',
              max_budget: data.category.max_budget || 0,
            });
          }
        } catch (err) {
          console.error('Error fetching category details:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchCategoryDetails(id);
    }
    return () => {
      isMounted = false;
    };
  }, [id, mode, token]);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('category_form.validation_name'));
      return;
    }

    const finalSlug = formData.slug.trim() || formData.name.toLowerCase().replace(/\s+/g, '-');
    setIsSaving(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL!;
      const isEdit = mode === 'edit';
      const url = isEdit ? `${apiUrl}/api/categories/${id}/update` : `${apiUrl}/api/categories/create`;
      const method = isEdit ? 'PATCH' : 'POST';
      const payload = {
        name: formData.name.trim(),
        slug: finalSlug,
        type: formData.type,
        category_image: formData.icon,
        category_color: formData.bg,
        max_budget: formData.max_budget,
      };

      if (token) {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.status === 201 || result.status === 200 || res.ok) {
          toast.success(result.message || (isEdit ? t('category_form.save_changes') : t('category_form.create_category')));
          router.push('/categories');
        } else {
          toast.error(result.message || t('category_form.save_error'));
        }
      }
    } catch {
      toast.error(t('category_form.save_error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
          {loading ? (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <Loader2 className="animate-spin" size={28} />
            </div>
          ) : (
            <>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <Tag size={16} />
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    {mode === 'edit' ? t('category_form.modal_edit_title') : t('category_form.modal_create_title')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Live Card Preview */}
                  <div>
                    <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                      {t('category_form.live_preview')}
                    </label>
                    <div
                      className="glass-card"
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: `linear-gradient(145deg, ${formData.bg} 0%, rgba(18, 18, 18, 0.95) 100%)`,
                        border: `1px solid ${formData.color}50`,
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: formData.bg,
                            border: `1px solid ${formData.color}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: formData.color,
                          }}
                        >
                          {React.createElement(getCategoryIconComponent(formData.icon), { size: 20, strokeWidth: 2.2 })}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                            {formData.name || t('category_form.default_name')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            #{formData.slug || t('category_form.default_slug')}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          background: formData.type === 'INCOME' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          color: formData.type === 'INCOME' ? '#34d399' : '#fb7185',
                          border: `1px solid ${formData.type === 'INCOME' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                        }}
                      >
                        {formData.type === 'INCOME' ? t('category_form.income') : t('category_form.expense')}
                      </span>
                    </div>
                  </div>

                  {/* Category Type Selector */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{t('category_form.classification_type')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                        style={{
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${formData.type === 'EXPENSE' ? '#f43f5e' : 'var(--border-subtle)'}`,
                          background: formData.type === 'EXPENSE' ? 'rgba(244, 63, 94, 0.12)' : '#0c0c0c',
                          color: formData.type === 'EXPENSE' ? '#fb7185' : 'var(--text-secondary)',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ArrowDownRight size={16} />
                        <span>{t('category_form.expense')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                        style={{
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-md)',
                          border: `1px solid ${formData.type === 'INCOME' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          background: formData.type === 'INCOME' ? 'rgba(16, 185, 129, 0.12)' : '#0c0c0c',
                          color: formData.type === 'INCOME' ? '#34d399' : 'var(--text-secondary)',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ArrowUpRight size={16} />
                        <span>{t('category_form.income')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Name */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{t('category_form.name_label')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('category_form.name_placeholder')}
                      className="form-input"
                    />
                  </div>

                  {/* Category Slug */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{t('category_form.slug_label')}</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder={t('category_form.slug_placeholder')}
                      className="form-input"
                    />
                  </div>

                  {/* Icon Selection Grid */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{t('category_form.icon_label')}</label>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '0.5rem',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        padding: '0.5rem',
                        background: '#0a0a0a',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {ICON_OPTIONS.map((item) => {
                        const ItemIcon = item.icon;
                        const isSelected = formData.icon.toLowerCase() === item.name.toLowerCase();
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: item.name })}
                            title={item.label}
                            style={{
                              height: '38px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 'var(--radius-sm)',
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                              background: isSelected ? 'var(--accent-light)' : 'transparent',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <ItemIcon size={18} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Palette Selection */}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{t('category_form.color_label')}</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {COLOR_OPTIONS.map((theme) => {
                        const isSelected = formData.bg.toLowerCase() === theme.bg.toLowerCase();
                        return (
                          <button
                            key={theme.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, bg: theme.bg, color: theme.color })}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: isSelected
                                ? `${theme.bg.replace('0.12', '1')}`
                                : `${theme.bg.replace('0.12', '0.4')}`,
                              border: isSelected
                                ? `2px solid ${theme.bg.replace('0.12', '0.5')}`
                                : '2px solid transparent',
                              boxShadow: isSelected ? `0 0 10px ${theme.bg}` : 'none',
                              cursor: 'pointer',
                              padding: 0,
                              position: 'relative',
                              transition: 'transform 0.15s ease',
                              transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                            }}
                            title={theme.name}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={() => router.push('/categories')}
                    type="button"
                    className="btn btn-secondary"
                    disabled={isSaving}
                  >
                    {t('category_form.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary"
                    style={{
                      opacity: isSaving ? 0.7 : 1,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSaving
                      ? t('category_form.saving')
                      : mode === 'edit'
                      ? t('category_form.save_changes')
                      : t('category_form.create_category')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
