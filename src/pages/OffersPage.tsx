// ─── Offers / Discounts Page ────────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount, toggleDiscount } from '@/services/discountService';
import { Button, Card, Input, Select, Toggle, Modal, EmptyState, Skeleton, PageHeader, Badge, ConfirmDialog, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Plus, Tag, Edit2, Trash2, Percent, DollarSign, Gift, Clock } from 'lucide-react';
import type { Discount, DiscountFormData, DiscountType } from '@/types';

const DISCOUNT_TYPES: { value: DiscountType; label: string; icon: typeof Percent }[] = [
  { value: 'percentage', label: 'Percentage Off', icon: Percent },
  { value: 'flat', label: 'Flat Discount', icon: DollarSign },
  { value: 'bogo', label: 'Buy X Get Y', icon: Gift },
  { value: 'coupon', label: 'Coupon Code', icon: Tag },
];

const EMPTY_FORM: DiscountFormData = {
  name: '', description: '', type: 'percentage', value: 0, code: '',
  productIds: [], categoryIds: [], startDate: '', endDate: '', startTime: '', endTime: '',
  active: true, usageLimit: 0, minOrderValue: 0, maxDiscount: 0, image: '', badge: '',
};

export default function OffersPage() {
  const { user } = useAuth();
  const [storeId, setStoreId] = useState('');
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DiscountFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (!stores.length) return;
    setStoreId(stores[0].id);
    setDiscounts(await getDiscounts(stores[0].id));
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); };
  const openEdit = (d: Discount) => {
    setForm({ name: d.name, description: d.description, type: d.type, value: d.value, code: d.code, productIds: d.productIds, categoryIds: d.categoryIds, startDate: '', endDate: '', startTime: d.startTime, endTime: d.endTime, active: d.active, usageLimit: d.usageLimit, minOrderValue: d.minOrderValue, maxDiscount: d.maxDiscount, image: d.image, badge: d.badge });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!storeId || !form.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) { await updateDiscount(storeId, editingId, form); toast.success('Offer updated'); }
      else { await createDiscount(storeId, form); toast.success('Offer created'); }
      setShowForm(false); await load();
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await toggleDiscount(storeId, id, active);
    await load();
  };

  const handleDelete = async () => {
    if (!storeId || !deleteId) return;
    await deleteDiscount(storeId, deleteId);
    toast.success('Offer deleted');
    setDeleteId(null);
    await load();
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{[1,2].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>;

  return (
    <PageTransition>
      <PageHeader title="Offers & Deals" description={`${discounts.length} offers`} action={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Create Offer</Button>} />

      {discounts.length === 0 ? (
        <Card><EmptyState icon={<Tag className="w-8 h-8" />} title="No offers yet" description="Create your first promotional offer to attract more customers." action={<Button icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Create Offer</Button>} /></Card>
      ) : (
        <div className="space-y-3">
          {discounts.map((d) => (
            <Card key={d.id} className="!p-0">
              <div className="flex items-center gap-4 p-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-coral to-accent-amber flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-surface-900">{d.name}</h3>
                    <Badge variant={d.active ? 'success' : 'default'}>{d.active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {d.type === 'percentage' && `${d.value}% off`}
                    {d.type === 'flat' && `₹${d.value} off`}
                    {d.type === 'bogo' && 'Buy X Get Y'}
                    {d.type === 'coupon' && `Code: ${d.code}`}
                    {d.description && ` — ${d.description}`}
                  </p>
                </div>
                <Toggle checked={d.active} onChange={(v) => handleToggle(d.id, v)} />
                <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-surface-100 text-surface-400"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(d.id)} className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingId ? 'Edit Offer' : 'Create Offer'} size="md">
        <div className="p-6 space-y-4">
          <Input label="Offer Name" placeholder="e.g., Summer Sale 20% OFF" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" placeholder="Get 20% off on all items" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Discount Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })} options={DISCOUNT_TYPES.map(t => ({ value: t.value, label: t.label }))} />
            <Input label={form.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} type="number" min={0} value={form.value || ''} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          </div>
          {form.type === 'coupon' && <Input label="Coupon Code" placeholder="e.g., SUMMER20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{editingId ? 'Update' : 'Create'}</Button>
          </div>
        </div>
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Offer" message="This offer will be permanently removed." confirmText="Delete" />
    </PageTransition>
  );
}
