// ─── Categories Page ────────────────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';
import { Button, Card, Input, Textarea, Modal, EmptyState, Skeleton, PageHeader, ConfirmDialog, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Plus, Grid3X3, Edit2, Trash2, GripVertical } from 'lucide-react';
import type { Category, CategoryFormData } from '@/types';

export default function CategoriesPage() {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormData>({ name: '', description: '', image: '', icon: '', visibility: true, featured: false });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (stores.length === 0) return;
    setStoreId(stores[0].id);
    const cats = await getCategories(stores[0].id);
    setCategories(cats);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ name: '', description: '', image: '', icon: '', visibility: true, featured: false }); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Category) => { setForm({ name: c.name, description: c.description, image: c.image, icon: c.icon, visibility: c.visibility, featured: c.featured }); setEditingId(c.id); setShowForm(true); };

  const handleSave = async () => {
    if (!storeId || !form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) { await updateCategory(storeId, editingId, form); toast.success('Category updated'); }
      else { await createCategory(storeId, form); toast.success('Category created'); }
      setShowForm(false);
      await load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!storeId || !deleteId) return;
    try { await deleteCategory(storeId, deleteId); toast.success('Category deleted'); setDeleteId(null); await load(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>;

  return (
    <PageTransition>
      <PageHeader title="Categories" description={`${categories.length} categories`} action={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Category</Button>} />
      {categories.length === 0 ? (
        <Card><EmptyState icon={<Grid3X3 className="w-8 h-8" />} title="No categories yet" description="Organize your products by creating categories." action={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Category</Button>} /></Card>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <Card key={c.id} className="!p-0">
              <div className="flex items-center gap-4 p-4">
                <GripVertical className="w-4 h-4 text-surface-300 cursor-grab shrink-0" />
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-lg shrink-0">
                  {c.icon || c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900">{c.name}</h3>
                  {c.description && <p className="text-xs text-surface-500 truncate">{c.description}</p>}
                </div>
                <span className="text-xs text-surface-400 shrink-0">{c.productCount || 0} products</span>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="p-6 space-y-4">
          <Input label="Category Name" placeholder="e.g., Starters" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          <Textarea label="Description" placeholder="Optional description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <Input label="Icon / Emoji" placeholder="🍕 or leave blank" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.name.trim()}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Category" message="Products in this category won't be deleted." confirmText="Delete" />
    </PageTransition>
  );
}
