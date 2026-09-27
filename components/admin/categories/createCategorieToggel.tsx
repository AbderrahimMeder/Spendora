"use client"
import { useState,useEffect } from 'react';
import { getCategoryIconComponent } from '@/utils/iconComponent';
import { Tag,X,ArrowDownRight,ArrowUpRight,Loader2} from 'lucide-react';
import {toast} from 'sonner';
import { ICON_OPTIONS ,COLOR_OPTIONS} from '@/utils/iconComponent';
import { useParams, useRouter } from 'next/navigation';
export function CreateToggle({
    token,
    mode,
}: {
    mode:'edit'|'create'
    token:string; 
}){
    const router = useRouter()
    const {id} = useParams()
    console.log(id)
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [Loading,setLoading]=useState<boolean>(false);
    const [formData,setFormData]=useState({
        name:"",
        slug:"",
        icon:"",
        type:"EXPENSE",
        color:"",
        bg:"",
        max_budget:0
    })
    const fetchCategoryDetails = async (categoryId: string) => {
    if (mode !== 'edit') return;
    try {
      setLoading(true)
      const apiUrl = process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL!;
      const res = await fetch(`${apiUrl}/api/categories/${categoryId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.status) {
        setFormData({
          name: data.category.name,
          slug: data.category.slug || '',
          icon: data.category.category_image || '',
          type: data.category.type || 'EXPENSE',
          color: data.category.category_color || '',
          bg: data.category.category_color || '',
          max_budget: data.category.max_budget || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching category details:', err);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (mode === 'edit' && id) fetchCategoryDetails(id as string);
  }, [id, mode, token]);
    const ActiveIconPreview = getCategoryIconComponent(formData.icon);
    const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

          if (!formData.name!.trim()) {
            toast.error('Please enter a category name');
            return;
          }

          const finalSlug = formData.slug!.trim() || formData.name!.toLowerCase().replace(/\s+/g, '-');
          setIsSaving(true);

          try {
            const apiUrl =process.env.LARAVEL_API_URL || process.env.LARAVEL_API_URL!;
            const isEdit = Boolean(mode==='edit');
            const url = isEdit ? `${apiUrl}/api/categories/${id}/update` : `${apiUrl}/api/categories/create`;
            const method = isEdit ? 'PATCH' : 'POST';
            const payload = {
              name: formData.name!.trim(),
              slug: finalSlug,
              type: formData.type!,
              category_image: formData.icon!,
              category_color: formData.bg!,
              max_budget:formData.max_budget
            };

            let succeeded = false;

            if (token) {
              try {
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
                if (result.status==201) {
                  succeeded = true;
                  toast.success(result.message);
                }else{
                    toast.error(result.message);
                }
              } catch (err) {
                console.warn('API error during category save:', err);
              }
            }
          } catch (err) {
            toast.error('Failed to save category');
          } finally {
            setIsSaving(false);
          }
        };
    return (
       <>
        <div className="modal-backdrop">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
          {Loading ? (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" size={24} />
            </div>
          ):(
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
                  {mode==='edit' ? 'Edit Category' : 'Create New Category'}
                </h2>
              </div>
              <div onClick={()=>router.back()} className="btn btn-secondary">
                <X size={16} />
              </div>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Live Card Preview */}
                <div>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Live Preview
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
                        <ActiveIconPreview size={20} strokeWidth={2.2} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.95rem' }}>
                          {formData.name || 'Category Name'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          #{formData.slug || 'category-slug'}
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
                      {formData.type}
                    </span>
                  </div>
                </div>

                {/* Category Type Selector */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Classification Type</label>
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
                      <span>Expense</span>
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
                      <span>Income</span>
                    </button>
                  </div>
                </div>

                {/* Category Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Food & Dining, Freelance Salary"
                    className="form-input"
                  />
                </div>

                {/* Category Slug */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Slug / Identifier</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. food-dining"
                    className="form-input"
                  />
                </div>

                {/* Icon Selection Grid */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category Icon</label>
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
                      const isSelected = formData.icon!.toLowerCase() === item.name.toLowerCase();
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
                  <label className="form-label">Color Theme</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {COLOR_OPTIONS.map((theme) => {
                      const isSelected = formData.bg.toLowerCase() === theme.bg.toLowerCase();
                      return (
                        <button
                          key={theme.name}
                          type="button"
                          onClick={() => setFormData({ ...formData,bg:theme.bg })}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor:isSelected ? `${theme.bg.replace('0.12','1')}` : `${theme.bg.replace('0.12','0.4')}`,
                            border: isSelected ? `2px solid ${theme.bg.replace('0.12','0.5')}` : '2px solid transparent',
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
                  onClick={()=>router.push('/categories')}
                  type="button"
                  className="btn btn-secondary cursor-pointer"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button 
                 type="submit"
                  disabled={isSaving}
                  className={`btn btn- ${
                    isSaving ? 'bg-emerald-950/90 cursor-not-allowed' : 'border-t-cyan-50  bg-emerald-700 cursor-pointer'
                  }`}
                >
                  {isSaving ? 'Saving...' : mode==='edit' ? 'Savce Changes' : 'Creacte Category'}
                </button>
              </div>
            </form>
            </>
          )}
          </div>
        </div>
       </>
    )
}
