// ─── Settings Page ──────────────────────────────────────────────────────────
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner, updateBusiness, getBusiness } from '@/services/storeService';
import { Button, Card, Input, Textarea, PageHeader, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Save, Store, Globe, Phone, MapPin, Link as LinkIcon, Shield } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/SocialIcons';
import type { Business } from '@/types';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState({ name: '', description: '', ownerName: '', phone: '', location: '', website: '', email: '', instagram: '', facebook: '', twitter: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (!stores.length) return;
    const biz = await getBusiness(stores[0].businessId);
    if (biz) {
      setBusiness(biz);
      setForm({
        name: biz.name, description: biz.description, ownerName: biz.ownerName,
        phone: biz.phone, location: biz.location, website: biz.website, email: biz.email || '',
        instagram: biz.socialLinks?.instagram || '', facebook: biz.socialLinks?.facebook || '', twitter: biz.socialLinks?.twitter || '',
      });
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!business) return;
    setSaving(true);
    try {
      await updateBusiness(business.id, {
        name: form.name, description: form.description, ownerName: form.ownerName,
        phone: form.phone, location: form.location, website: form.website, email: form.email,
        socialLinks: { instagram: form.instagram, facebook: form.facebook, twitter: form.twitter },
      });
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  return (
    <PageTransition>
      <PageHeader title="Settings" description="Manage your business information" />

      <div className="space-y-6 max-w-2xl">
        <Card>
          <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Store className="w-4 h-4 text-brand-600" /> Business Info</h3>
          <div className="space-y-4">
            <Input label="Business Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Textarea label="Description / Bio" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            <Input label="Owner Name" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-brand-600" /> Contact</h3>
          <div className="space-y-4">
            <Input label="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={<Phone className="w-4 h-4" />} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} icon={<MapPin className="w-4 h-4" />} />
            <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} icon={<Globe className="w-4 h-4" />} />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-brand-600" /> Social Links</h3>
          <div className="space-y-4">
            <Input label="Instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} icon={<InstagramIcon className="w-4 h-4" />} />
            <Input label="Facebook" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} icon={<FacebookIcon className="w-4 h-4" />} />
            <Input label="Twitter / X" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} icon={<TwitterIcon className="w-4 h-4" />} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>Save Settings</Button>
        </div>

        <Card className="border-red-200 !bg-red-50/50">
          <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Account</h3>
          <p className="text-sm text-red-600 mb-4">Signed in as {user?.email}</p>
          <Button variant="danger" size="sm" onClick={logout}>Sign Out</Button>
        </Card>
      </div>
    </PageTransition>
  );
}
