// ─── Onboarding Wizard ──────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Textarea, ImageUpload, toast } from '@/components/ui';
import { createBusiness } from '@/services/storeService';
import { uploadImage } from '@/lib/storage';
import { BUSINESS_TYPES } from '@/lib/constants';
import { themeList } from '@/themes/themeRegistry';
import {
  ArrowLeft, ArrowRight, Check, Store, Sparkles, Camera,
  MapPin, Phone, Globe, Type,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/SocialIcons';
import { clsx } from 'clsx';
import type { BusinessType, SocialLinks } from '@/types';

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [selectedTheme, setSelectedTheme] = useState('macha_boba');

  const handleFileSelect = useCallback((file: File, type: 'logo' | 'cover') => {
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoFile(file); setLogoPreview(url); }
    else { setCoverFile(file); setCoverPreview(url); }
  }, []);

  const canProceed = () => {
    if (step === 0) return businessName.trim().length >= 2;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let logoUrl = '';
      let coverUrl = '';

      if (logoFile) {
        const r = await uploadImage(logoFile, `businesses/${user.uid}/logos`);
        logoUrl = r.url;
      }
      if (coverFile) {
        const r = await uploadImage(coverFile, `businesses/${user.uid}/covers`);
        coverUrl = r.url;
      }

      await createBusiness({
        name: businessName,
        type: businessType,
        logo: logoUrl,
        cover: coverUrl,
        description,
        ownerName: user.displayName || '',
        phone,
        location,
        website,
        socialLinks,
        email: user.email || '',
        themeId: selectedTheme,
      }, user.uid);

      toast.success('Your store has been created! 🎉');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create store. Please try again.';
      toast.error(msg);
      console.error(err);
    }
    setSaving(false);
  };

  const next = () => { if (step < TOTAL_STEPS - 1 && canProceed()) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);
  const goNext = () => { setDirection(1); next(); };
  const goPrev = () => { setDirection(-1); prev(); };

  const steps = [
    // Step 0: Business Name
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">What's your business called?</h2>
        <p className="text-surface-500 text-sm">This will appear on your storefront and QR code</p>
      </div>
      <Input
        placeholder="e.g., Matcha & Boba Cafe"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="text-center text-lg !h-14 !rounded-2xl"
        autoFocus
      />
    </div>,

    // Step 1: Business Type
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">What type of business?</h2>
        <p className="text-surface-500 text-sm">This helps us customize your storefront layout</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {BUSINESS_TYPES.map((bt) => (
          <button
            key={bt.value}
            onClick={() => setBusinessType(bt.value as BusinessType)}
            className={clsx(
              'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200',
              businessType === bt.value
                ? 'border-brand-500 bg-brand-50 shadow-sm'
                : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50'
            )}
          >
            <span className="text-2xl">{bt.icon}</span>
            <span className="text-xs font-medium text-surface-700">{bt.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Logo & Cover
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-brand-600" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Add your branding</h2>
        <p className="text-surface-500 text-sm">Upload your logo and cover banner (optional)</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ImageUpload label="Logo" value={logoPreview} onChange={(f) => handleFileSelect(f, 'logo')} aspect="square" />
        <ImageUpload label="Cover Image" value={coverPreview} onChange={(f) => handleFileSelect(f, 'cover')} aspect="square" />
      </div>
    </div>,

    // Step 3: Description
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Describe your business</h2>
        <p className="text-surface-500 text-sm">A short bio that appears on your storefront</p>
      </div>
      <Textarea
        placeholder="e.g., Premium boba tea, artisan pastries & delicious handcrafted meals made fresh daily."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
    </div>,

    // Step 4: Contact
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Contact details</h2>
        <p className="text-surface-500 text-sm">All fields are optional</p>
      </div>
      <div className="space-y-4">
        <Input label="Phone / WhatsApp" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} />
        <Input label="Location" placeholder="Indiranagar, Bangalore" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin className="w-4 h-4" />} />
        <Input label="Website" placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)} icon={<Globe className="w-4 h-4" />} />
      </div>
    </div>,

    // Step 5: Social Links
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 mb-2">Social media links</h2>
        <p className="text-surface-500 text-sm">Help customers find you online (optional)</p>
      </div>
      <div className="space-y-4">
        <Input label="Instagram" placeholder="@yourbusiness" value={socialLinks.instagram || ''} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} icon={<InstagramIcon className="w-4 h-4" />} />
        <Input label="Facebook" placeholder="facebook.com/yourbusiness" value={socialLinks.facebook || ''} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} icon={<FacebookIcon className="w-4 h-4" />} />
        <Input label="Twitter / X" placeholder="@yourbusiness" value={socialLinks.twitter || ''} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} icon={<TwitterIcon className="w-4 h-4" />} />
      </div>
    </div>,

    // Step 6: 15 Storefront Templates Catalog Grid
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 text-amber-600">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-surface-900 mb-1">Select Storefront Template</h2>
        <p className="text-surface-500 text-sm">Choose from 15 curated design templates for Boba, Pastries, Biryani, Poke, Bistro & more</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
        {themeList.map((t) => {
          const isSelected = selectedTheme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={clsx(
                'group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between text-left',
                isSelected
                  ? 'border-brand-500 shadow-xl ring-2 ring-brand-500/20 scale-[1.02]'
                  : 'border-surface-200 hover:border-surface-400 hover:shadow-md'
              )}
              style={{ backgroundColor: t.colors.surface }}
            >
              {/* Preview Banner Thumbnail */}
              <div className="relative h-32 overflow-hidden bg-slate-900">
                <img
                  src={t.heroImage}
                  alt={t.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Category Pill Badge */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                  {t.category || 'Store'}
                </div>

                {/* Typography Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1 border border-white/30">
                  <Type className="w-3 h-3" /> {t.typography.headingFont}
                </div>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between" style={{ color: t.colors.text }}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-extrabold" style={{ fontFamily: t.typography.headingFont }}>
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80 line-clamp-2">{t.description}</p>
                </div>

                {/* Color Palette & Badge text */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {[t.colors.primary, t.colors.accent, t.colors.background].map((c, i) => (
                      <span key={i} className="w-4 h-4 rounded-full border border-white/60 shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 uppercase tracking-wider">
                    {t.badgeText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Progress */}
      <div className={clsx('w-full transition-all duration-300 mb-8', step === 6 ? 'max-w-5xl' : 'max-w-md')}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-surface-500">Step {step + 1} of {TOTAL_STEPS}</span>
          <span className="text-xs text-surface-400">{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-violet rounded-full"
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className={clsx('w-full bg-white rounded-3xl border border-surface-200 shadow-sm p-6 sm:p-8 min-h-[440px] flex flex-col transition-all duration-300', step === 6 ? 'max-w-5xl' : 'max-w-md')}>
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-surface-100">
          <Button variant="ghost" onClick={goPrev} disabled={step === 0} icon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
          {step < TOTAL_STEPS - 1 ? (
            <Button onClick={goNext} disabled={!canProceed()} icon={<ArrowRight className="w-4 h-4" />}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={saving} icon={<Check className="w-4 h-4" />}>
              Create Store
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

