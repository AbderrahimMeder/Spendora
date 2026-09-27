'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCategoryIconComponent } from '@/utils/iconComponent';
import {
  Search,
  Plus,
  Tag,
  Edit2,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { Category, User } from '@/types';

interface CardCategoriesProps {
  token?: string | null;
  user?: User;
  initialCategories?: Category[];
}

export function CardCategories({ token, user, initialCategories }: CardCategoriesProps) {
  const router=useRouter()
  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(!initialCategories);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'type' | 'newest'>('name-asc');

  // Modal States
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  //pagination 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  // Fetch Categories from Backend API
  const fetchCategories = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const apiUrl = process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL!;
      const response = await fetch(`${apiUrl}/api/categories`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const apiCategories = data.categories;
        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          setCategories(data.categories);
        } 
      } 
    } catch (error) {
      console.warn('API fetch warning, using fallback category data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);


  // Delete Category
  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const apiUrl = process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL!;
      let succeeded = false;

      if (token) {
        try {
          const res = await fetch(`${apiUrl}/api/categories/${deleteTarget.id}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            succeeded = true;
          }
        } catch (err) {
          console.warn('API delete error:', err);
        }
      }

      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success(`Category "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Slug to Clipboard
  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    setCopiedSlug(slug);
    toast.success('Category slug copied to clipboard');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Compute Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    return { total };
  }, [categories]);

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => {
        const matchesQuery =
          (cat.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cat.slug || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || cat.type === filterType;
        return matchesQuery && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'type') return (a.type || '').localeCompare(b.type || '');
        return 0;
      });
  }, [categories, searchQuery, filterType, sortBy]);
  const totalPages = Math.max(1, Math.ceil(categories.length / itemsPerPage));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return categories.slice(start, start + itemsPerPage);
  }, [categories, currentPage, itemsPerPage]);
  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header Bar */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Categories
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 9px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontWeight: '700',
              }}
            >
              {stats.total} Total
            </span>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Manage and organize your financial classification for expense tracking and revenue streams.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => fetchCategories(true)}
            disabled={refreshing}
            className="btn btn-secondary"
            title="Refresh Categories"
            style={{ padding: '0.65rem 0.9rem' }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>

          <Link
            href='/categories/new'
            className="btn btn-primary"
            style={{
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              boxShadow: 'var(--accent-glow)',
            }}
          >
            <Plus size={16} />
            <span>Create Category</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Summary Cards */}

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="form-input"
            style={{
              paddingLeft: '2.4rem',
              fontSize: '0.875rem',
              height: '40px',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills & Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Type Filters */}
          <div
            style={{
              display: 'inline-flex',
              background: '#0c0c0c',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filterType === type ? 'var(--accent-primary)' : 'transparent',
                  color: filterType === type ? '#000000' : 'var(--text-secondary)',
                }}
              >
                {type === 'ALL' ? 'All' : type === 'EXPENSE' ? 'Expenses' : 'Income'}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="form-select"
              style={{
                height: '40px',
                padding: '0.4rem 2rem 0.4rem 0.85rem',
                fontSize: '0.825rem',
                cursor: 'pointer',
              }}
            >
              <option value="name-asc">(A-Z)</option>
              <option value="name-desc"> (Z-A)</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {[1, 2, 3, 4, 5, 6,7,8].map((idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                height: '180px',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#121212',
                animation: 'skeleton-pulse 1.5s ease-in-out infinite',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#222' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: '16px', background: '#222', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ width: '40%', height: '12px', background: '#1c1c1c', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ width: '80px', height: '24px', background: '#222', borderRadius: '12px' }} />
            </div>
          ))}
        </div>
      ) : paginatedCategories.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '3.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Tag size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.4rem 0' }}>
            No categories found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 0 1.5rem 0' }}>
            {searchQuery
              ? `No category matches "${searchQuery}". Try searching with another keyword.`
              : 'You have not added any categories yet. Create your first category to get started.'}
          </p>
          <button onClick={()=>router.push('/categories/new')} className="btn btn-primary">
            <Plus size={16} />
            <span>Create New Category</span>
          </button>
        </div>
      ) : (
        <>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {paginatedCategories.map((cat) => {
            const Icon = getCategoryIconComponent(cat?.category_image);
            const isIncome = cat.type === 'INCOME';
            const cardColor = cat?.category_color;
            const cardBg = `${cat?.category_color}`

            return (
              <div
                key={cat.id}
                className="glass-card"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(145deg, ${cardBg.replace('0.12', '0.2')} 0%, rgba(18, 18, 18, 0.85) 100%)`,
                  border: `1px solid var(--border-subtle)`,
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = cardBg??'black';
                  e.currentTarget.style.boxShadow = `0 10px 25px -5px ${cardBg}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                  {/* Icon & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: cardBg,
                        border: `1px solid ${cardColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cardBg.replace('0.12','1'),
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} strokeWidth={2.2} />
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: '700',
                          color: '#ffffff',
                          margin: '0 0 0.2rem 0',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {cat.name}
                      </h3>
                      <button
                        onClick={() => handleCopySlug(cat.slug || cat!.name!.toLowerCase().replace(/\s+/g, '-'))}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                        }}
                        title="Click to copy slug"
                      >
                        <span>#{cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}</span>
                        {copiedSlug === (cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')) ? (
                          <Check size={11} color="#10b981" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions Dropdown / Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => router.push(`/categories/edit/${cat.id}`)}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px', padding: 0 }}
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px', padding: 0, color: '#fb7185' }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {/* Card Bottom Row: Badges and Color Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {/* Type Tag */}
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      color: isIncome ? '#34d399' : '#fb7185',
                      border: `1px solid ${isIncome ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isIncome ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isIncome ? 'INCOME' : 'EXPENSE'}
                  </span>

                  {/* Color Swatch / Visual Dot */}
                  {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: cardColor,
                        boxShadow: `0 0 8px ${cardColor}`,
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {cardColor}
                    </span>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          {categories.length > 0 && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                background: '#0a0a0a',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                Showing{' '}
                <span style={{ fontWeight: '700', color: '#ffffff' }}>
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span style={{ fontWeight: '700', color: '#ffffff' }}>
                  {Math.min(currentPage * itemsPerPage, categories.length)}
                </span>{' '}
                of{' '}
                <span style={{ fontWeight: '700', color: '#ffffff' }}>
                  {categories.length}
                </span>{' '}
                entries
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Items Per Page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{
                      background: '#121212',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '0.2rem 0.4rem',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={36}>36</option>
                  </select>
                </div>

                {/* Prev / Next Pagination */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      background: '#141414',
                      border: '1px solid var(--border-subtle)',
                      color: currentPage <= 1 ? 'var(--text-muted)' : '#ffffff',
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <span style={{ fontSize: '0.75rem', padding: '0 0.4rem' }}>
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      padding: '0.3rem 0.5rem',
                      borderRadius: '4px',
                      background: '#141414',
                      border: '1px solid var(--border-subtle)',
                      color: currentPage >= totalPages ? 'var(--text-muted)' : '#ffffff',
                      cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(244, 63, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f43f5e',
                  }}
                >
                  <AlertTriangle size={16} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Delete Category
                </h2>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-icon"
                style={{ width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Are you sure you want to delete the category{' '}
                <strong style={{ color: '#ffffff' }}>"{deleteTarget.name}"</strong>? Existing transactions assigned to
                this category will remain in your database.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="btn"
                style={{
                  background: '#f43f5e',
                  color: '#ffffff',
                  fontWeight: '700',
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
