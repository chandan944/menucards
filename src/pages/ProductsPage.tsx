// ─── Products Management Page ───────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { uploadImage } from '@/lib/storage';
import { Button, Card, Input, Textarea, Select, Toggle, Modal, EmptyState, Skeleton, PageHeader, Badge, ConfirmDialog, ImageUpload, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Plus, Search, ShoppingBag, Edit2, Trash2, MoreHorizontal, X, ImagePlus } from 'lucide-react';
import { clsx } from 'clsx';
import type { Product, ProductFormData, Category } from '@/types';

const EMPTY_FORM: ProductFormData = {
  name: '', description: '', categoryId: '', price: 0, salePrice: undefined, sku: '',
  tags: [], status: 'active', featured: false, bestseller: false, isNew: false,
  veg: false, spicy: false, premium: false, availability: true,
  variants: [], addons: [], customAttributes: {},
};

export default function ProductsPage() {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const stores = await getStoresByOwner(user.uid);
      if (stores.length === 0) return;
      const sid = stores[0].id;
      setStoreId(sid);
      const [p, c] = await Promise.all([getProducts(sid), getCategories(sid)]);
      setProducts(p);
      setCategories(c);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, categoryId: p.categoryId, price: p.price,
      salePrice: p.salePrice, sku: p.sku, tags: p.tags, status: p.status,
      featured: p.featured, bestseller: p.bestseller, isNew: p.isNew,
      veg: p.veg, spicy: p.spicy, premium: p.premium, availability: p.availability,
      variants: p.variants || [], addons: p.addons || [], customAttributes: p.customAttributes || {},
    });
    setEditingId(p.id);
    setImagePreview(p.mainImage || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!storeId || !form.name.trim()) return;
    setSaving(true);
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        const r = await uploadImage(imageFile, `stores/${storeId}/products`);
        imageUrl = r.url;
      }
      if (editingId) {
        await updateProduct(storeId, editingId, { ...form, ...(imageUrl !== imagePreview ? {} : {}) });
        toast.success('Product updated');
      } else {
        await createProduct(storeId, form, imageUrl);
        toast.success('Product created');
      }
      setShowForm(false);
      await load();
    } catch (err) { toast.error('Failed to save product'); console.error(err); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!storeId || !deleteId) return;
    setDeleting(true);
    try {
      await deleteProduct(storeId, deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      await load();
    } catch { toast.error('Failed to delete'); }
    setDeleting(false);
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || p.categoryId === filterCategory;
    return matchSearch && matchCat;
  });

  const catMap = categories.reduce<Record<string, string>>((a, c) => { a[c.id] = c.name; return a; }, {});

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid gap-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div></div>;
  }

  return (
    <PageTransition>
      <PageHeader
        title="Products"
        description={`${products.length} products in your catalog`}
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Product</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
        </div>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          options={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </div>

      {/* Product List */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8" />}
            title={search ? 'No products found' : 'No products yet'}
            description={search ? 'Try a different search term' : 'Add your first product to get started'}
            action={!search ? <Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Product</Button> : undefined}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id} hover onClick={() => openEdit(p)} className="!p-0">
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-xl bg-surface-100 overflow-hidden shrink-0">
                  {p.mainImage ? (
                    <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300"><ImagePlus className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-surface-900 truncate">{p.name}</h3>
                    {p.featured && <Badge variant="brand">Featured</Badge>}
                    {p.bestseller && <Badge variant="danger">Bestseller</Badge>}
                    {p.isNew && <Badge variant="success">New</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-bold text-surface-900">₹{p.price}</span>
                    {p.salePrice && <span className="text-xs text-surface-400 line-through">₹{p.salePrice}</span>}
                    {catMap[p.categoryId] && <span className="text-xs text-surface-500">• {catMap[p.categoryId]}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant={p.status === 'active' ? 'success' : 'default'}>{p.status}</Badge>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                    className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Product Name" placeholder="e.g., Margherita Pizza" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={[{ value: '', label: 'Select category' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
          </div>
          <Textarea label="Description" placeholder="Describe this product..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Input label="Price (₹)" type="number" min={0} value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Input label="Sale Price (₹)" type="number" min={0} value={form.salePrice || ''} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) || undefined })} />
            <Input label="SKU" placeholder="Optional" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>

          <ImageUpload
            label="Product Image"
            value={imagePreview}
            onChange={(f) => { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }}
            aspect="square"
            className="max-w-[200px]"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured" />
            <Toggle checked={form.bestseller} onChange={(v) => setForm({ ...form, bestseller: v })} label="Bestseller" />
            <Toggle checked={form.isNew} onChange={(v) => setForm({ ...form, isNew: v })} label="New" />
            <Toggle checked={form.veg} onChange={(v) => setForm({ ...form, veg: v })} label="Veg" />
            <Toggle checked={form.spicy} onChange={(v) => setForm({ ...form, spicy: v })} label="Spicy" />
            <Toggle checked={form.premium} onChange={(v) => setForm({ ...form, premium: v })} label="Premium" />
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-surface-700">Variants</label>
              <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, variants: [...form.variants, { id: Date.now().toString(), name: '', price: 0, available: true }] })}>
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            {form.variants.map((v, i) => (
              <div key={v.id} className="flex items-center gap-2 mb-2">
                <Input placeholder="Name (e.g., Large)" value={v.name} onChange={(e) => { const vars = [...form.variants]; vars[i] = { ...v, name: e.target.value }; setForm({ ...form, variants: vars }); }} className="flex-1" />
                <Input type="number" placeholder="Price" value={v.price || ''} onChange={(e) => { const vars = [...form.variants]; vars[i] = { ...v, price: Number(e.target.value) }; setForm({ ...form, variants: vars }); }} className="w-28" />
                <button onClick={() => setForm({ ...form, variants: form.variants.filter((_, j) => j !== i) })} className="p-2 text-surface-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          {/* Addons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-surface-700">Add-ons</label>
              <Button variant="ghost" size="sm" onClick={() => setForm({ ...form, addons: [...form.addons, { id: Date.now().toString(), name: '', price: 0, available: true }] })}>
                <Plus className="w-3 h-3" /> Add
              </Button>
            </div>
            {form.addons.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 mb-2">
                <Input placeholder="Name (e.g., Extra Cheese)" value={a.name} onChange={(e) => { const adds = [...form.addons]; adds[i] = { ...a, name: e.target.value }; setForm({ ...form, addons: adds }); }} className="flex-1" />
                <Input type="number" placeholder="+Price" value={a.price || ''} onChange={(e) => { const adds = [...form.addons]; adds[i] = { ...a, price: Number(e.target.value) }; setForm({ ...form, addons: adds }); }} className="w-28" />
                <button onClick={() => setForm({ ...form, addons: form.addons.filter((_, j) => j !== i) })} className="p-2 text-surface-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.name.trim()}>
              {editingId ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="This product will be permanently removed from your catalog."
        confirmText="Delete"
        loading={deleting}
      />
    </PageTransition>
  );
}
