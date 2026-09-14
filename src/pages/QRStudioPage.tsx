// ─── QR Studio Page ─────────────────────────────────────────────────────────
import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoresByOwner } from '@/services/storeService';
import { Button, Card, Input, Select, PageHeader, toast } from '@/components/ui';
import { PageTransition } from '@/storefront/animations';
import { Download, QrCode, Palette, Eye, Type, Square, Circle, Sparkles, Copy, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import QRCodeStyling from 'qr-code-styling';
import type { Store } from '@/types';
import type { QRPattern, QREyeStyle } from '@/types/qr';

const PATTERNS: { value: string; label: string }[] = [
  { value: 'dots', label: 'Dots' }, { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' }, { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'square', label: 'Square' }, { value: 'extra-rounded', label: 'Extra Rounded' },
];

const EYE_STYLES: { value: string; label: string }[] = [
  { value: 'square', label: 'Square' }, { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Rounded' },
];

const PRESETS = [
  { name: 'Minimal', dotColor: '#000000', bgColor: '#FFFFFF', pattern: 'square' as const, eyeStyle: 'square' as const },
  { name: 'Modern', dotColor: '#4263eb', bgColor: '#FFFFFF', pattern: 'rounded' as const, eyeStyle: 'dot' as const },
  { name: 'Luxury', dotColor: '#c9a84c', bgColor: '#0f0f1a', pattern: 'classy-rounded' as const, eyeStyle: 'extra-rounded' as const },
  { name: 'Neon', dotColor: '#00f5d4', bgColor: '#0a0a1a', pattern: 'dots' as const, eyeStyle: 'dot' as const },
  { name: 'Cafe', dotColor: '#3c2415', bgColor: '#fdf6ee', pattern: 'extra-rounded' as const, eyeStyle: 'extra-rounded' as const },
  { name: 'Corporate', dotColor: '#1e293b', bgColor: '#f8fafc', pattern: 'classy' as const, eyeStyle: 'square' as const },
];

const FRAME_TEXTS = ['SCAN ME', 'VIEW MENU', 'OPEN STORE', 'SCAN TO ORDER', 'EXPLORE'];

export default function QRStudioPage() {
  const { user } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);
  const [store, setStore] = useState<Store | null>(null);

  // QR Design State
  const [dotColor, setDotColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [pattern, setPattern] = useState('rounded');
  const [eyeStyle, setEyeStyle] = useState('dot');
  const [size, setSize] = useState(280);
  const [margin, setMargin] = useState(20);
  const [frameText, setFrameText] = useState('SCAN ME');
  const [showFrame, setShowFrame] = useState(true);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');

  const storeUrl = store ? `${window.location.origin}/s/${store.slug}?src=qr` : '';

  const load = useCallback(async () => {
    if (!user) return;
    const stores = await getStoresByOwner(user.uid);
    if (stores.length > 0) setStore(stores[0]);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // Generate QR
  useEffect(() => {
    if (!storeUrl || !qrRef.current) return;

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      data: storeUrl,
      margin: margin,
      dotsOptions: {
        color: dotColor,
        type: pattern as any,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: eyeStyle as any,
        color: dotColor,
      },
      cornersDotOptions: {
        type: eyeStyle === 'dot' ? 'dot' : 'square',
        color: dotColor,
      },
      qrOptions: {
        errorCorrectionLevel: errorCorrection,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
      },
    });

    qrRef.current.innerHTML = '';
    qr.append(qrRef.current);
    qrInstance.current = qr;
  }, [storeUrl, dotColor, bgColor, pattern, eyeStyle, size, margin, errorCorrection]);

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!qrInstance.current) return;
    try {
      await qrInstance.current.download({ name: `qr-${store?.slug || 'store'}`, extension: format });
      toast.success(`QR downloaded as ${format.toUpperCase()}`);
    } catch { toast.error('Download failed'); }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setDotColor(preset.dotColor);
    setBgColor(preset.bgColor);
    setPattern(preset.pattern);
    setEyeStyle(preset.eyeStyle);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success('Store URL copied!');
  };

  return (
    <PageTransition>
      <PageHeader title="QR Studio" description="Design and customize your store QR code" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Presets */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-600" /> Quick Presets</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESETS.map((p) => (
                <button key={p.name} onClick={() => applyPreset(p)} className="p-3 rounded-xl border border-surface-200 hover:border-brand-300 hover:shadow-sm transition-all text-center">
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2 border border-surface-200" style={{ background: `linear-gradient(135deg, ${p.dotColor} 50%, ${p.bgColor} 50%)` }} />
                  <span className="text-xs font-medium text-surface-700">{p.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Colors */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-brand-600" /> Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700">QR Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="w-10 h-10 rounded-xl border border-surface-200 cursor-pointer" />
                  <Input value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-surface-700">Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl border border-surface-200 cursor-pointer" />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Pattern & Eyes */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Square className="w-4 h-4 text-brand-600" /> Style</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Dot Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} options={PATTERNS} />
              <Select label="Eye Style" value={eyeStyle} onChange={(e) => setEyeStyle(e.target.value)} options={EYE_STYLES} />
            </div>
          </Card>

          {/* Frame */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Type className="w-4 h-4 text-brand-600" /> Frame Text</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {FRAME_TEXTS.map((t) => (
                <button key={t} onClick={() => setFrameText(t)} className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  frameText === t ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}>{t}</button>
              ))}
            </div>
            <Input value={frameText} onChange={(e) => setFrameText(e.target.value)} placeholder="Custom text..." />
          </Card>

          {/* Settings */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-4">Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Size (px)" type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} min={150} max={600} />
              <Input label="Margin (px)" type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} min={0} max={50} />
              <Select label="Error Correction" value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')} options={[{ value: 'L', label: 'Low' }, { value: 'M', label: 'Medium' }, { value: 'Q', label: 'Quartile' }, { value: 'H', label: 'High' }]} />
            </div>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <Card className="flex flex-col items-center">
            <h3 className="font-semibold text-surface-900 mb-4 flex items-center gap-2"><Eye className="w-4 h-4 text-brand-600" /> Preview</h3>

            {/* QR with Frame */}
            <div className="relative inline-flex flex-col items-center p-6 rounded-2xl border-2 border-surface-200" style={{ backgroundColor: bgColor }}>
              {showFrame && frameText && (
                <div className="mb-3 px-4 py-1 rounded-full text-xs font-bold tracking-wider" style={{ backgroundColor: dotColor, color: bgColor }}>
                  {frameText}
                </div>
              )}
              <div ref={qrRef} />
              {showFrame && store && (
                <p className="mt-3 text-xs font-medium" style={{ color: dotColor }}>{store.name}</p>
              )}
            </div>

            {/* Store URL */}
            <div className="w-full mt-4 flex items-center gap-2 bg-surface-50 rounded-xl px-3 py-2">
              <code className="text-xs text-surface-600 truncate flex-1">{storeUrl}</code>
              <button onClick={copyUrl} className="p-1.5 rounded-lg hover:bg-surface-200 text-surface-400"><Copy className="w-3.5 h-3.5" /></button>
            </div>
          </Card>

          {/* Download */}
          <Card>
            <h3 className="font-semibold text-surface-900 mb-3">Download</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" onClick={() => handleDownload('png')} icon={<Download className="w-4 h-4" />}>PNG</Button>
              <Button variant="secondary" onClick={() => handleDownload('svg')} icon={<Download className="w-4 h-4" />}>SVG</Button>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
