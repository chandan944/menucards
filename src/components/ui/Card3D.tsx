import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/SocialIcons';
import { Phone, Mail, Globe, MapPin, QrCode, Sparkles, Wifi, Tag, Award, Gift, Star, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

export interface CardConfig {
  orientation: 'portrait' | 'landscape' | 'square';
  templateId: string;
  
  // ─── Merged QR Customization Options ─────────────────────────────────────
  qr: {
    dataUrl: string;
    size: 'small' | 'medium' | 'large';
    position: 'center' | 'bottom' | 'side' | 'top';
    dotPattern: 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    eyeStyle: 'square' | 'dot' | 'extra-rounded';
    dotColor: string;
    bgColor: string;
    useCardAccentForQR: boolean;
    logoUrl?: string;
    frameText?: string;
    showFrameText: boolean;
  };

  // ─── Front Side Customization ─────────────────────────────────────────────
  front: {
    layout: 'classic' | 'center-qr' | 'hero-avatar' | 'split-modern' | 'badge-script' | 'minimalist' | 'bottom-stack';
    headerTitle: string;
    headerSubtitle: string;
    scriptFont: boolean;
    avatarUrl: string;
    showAvatar: boolean;
    avatarShape: 'circle' | 'rounded' | 'square';
    badgeText?: string;
    showBadge?: boolean;
    qrLabel: string;
    showQR: boolean;

    showPhone: boolean;
    phone: string;
    showEmail: boolean;
    email: string;
    showWebsite: boolean;
    website: string;
    showLocation: boolean;
    location: string;
    
    showSocials: boolean;
    instagram: string;
    facebook: string;
    twitter: string;
    whatsapp: string;
  };

  // ─── Back Side (Greetings, Loyalty, WiFi, Hours, Notes) ──────────────────
  back: {
    layout: 'greeting' | 'loyalty-stamp' | 'wifi-card' | 'business-hours' | 'social-grid' | 'minimal-logo';
    brandName: string;
    tagline: string;
    logoUrl: string;
    showLogo: boolean;
    
    greetingPreset: 'thank-you' | 'discount-voucher' | 'welcome' | 'scan-menu' | 'custom';
    greetingTitle: string;
    greetingBody: string;
    couponCode?: string;
    showCoupon?: boolean;
    
    loyaltyStampsCount: 5 | 8 | 10;
    loyaltyRewardText: string;
    
    wifiName?: string;
    wifiPass?: string;
    
    businessHours?: string;
    showSecondaryQR: boolean;
  };

  // ─── Materials, Finishes & Color Styles ──────────────────────────────────
  styles: {
    material: 'claymorphic' | 'neobrutalism' | 'maximalism' | 'frosted-glass' | 'cyber-neon' | 'holographic' | 'gold-foil' | 'kraft-paper' | 'brushed-metal' | 'royal-velvet' | 'monochrome-serif' | 'nordic-ice' | 'matte' | 'glossy-glass';
    cardShape?: 'rounded' | 'pill' | 'sharp' | 'chamfer' | 'arch';
    bgType: 'solid' | 'gradient';
    bgColor1: string;
    bgColor2: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: number;
    pattern: 'none' | 'dots' | 'waves' | 'grid' | 'stripes' | 'topographic' | 'sparkles';
    borderStyle: 'none' | 'solid' | 'dashed' | 'gold-border' | 'double' | 'glowing';
  };
}

interface Card3DProps {
  config: CardConfig;
  isFlipped: boolean;
  onFlip?: () => void;
  className?: string;
  scale?: number;
}

export function Card3D({ config, isFlipped, onFlip, className, scale = 1 }: Card3DProps) {
  const frontQrRef = useRef<HTMLDivElement>(null);
  const backQrRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isPortrait = config.orientation === 'portrait';
  const isSquare = config.orientation === 'square';
  
  let width = isPortrait ? 330 : 490;
  let height = isPortrait ? 540 : 310;
  if (isSquare) {
    width = 400;
    height = 400;
  }

  // Render QR Code with Merged Settings
  useEffect(() => {
    if (!config.qr.dataUrl) return;

    let qrSize = 135;
    if (config.qr.size === 'small') qrSize = 105;
    if (config.qr.size === 'large') qrSize = 165;

    const qrOptions = {
      width: qrSize,
      height: qrSize,
      data: config.qr.dataUrl,
      margin: 2,
      image: config.qr.logoUrl || undefined,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 3,
        imageSize: 0.25,
      },
      dotsOptions: {
        color: config.qr.useCardAccentForQR ? config.styles.accentColor : config.qr.dotColor || config.styles.textColor,
        type: config.qr.dotPattern || 'rounded',
      },
      backgroundOptions: {
        color: config.qr.bgColor || 'transparent',
      },
      cornersSquareOptions: {
        color: config.qr.useCardAccentForQR ? config.styles.accentColor : config.qr.dotColor || config.styles.textColor,
        type: config.qr.eyeStyle || 'extra-rounded',
      },
      cornersDotOptions: {
        color: config.qr.useCardAccentForQR ? config.styles.accentColor : config.qr.dotColor || config.styles.textColor,
        type: (config.qr.eyeStyle === 'dot' ? 'dot' : 'square') as 'dot' | 'square',
      },
    };

    try {
      const frontQr = new QRCodeStyling(qrOptions);
      if (frontQrRef.current) {
        frontQrRef.current.innerHTML = '';
        frontQr.append(frontQrRef.current);
      }

      if (config.back.showSecondaryQR && backQrRef.current) {
        const backQr = new QRCodeStyling({ ...qrOptions, width: 110, height: 110 });
        backQrRef.current.innerHTML = '';
        backQr.append(backQrRef.current);
      }
    } catch (err) {
      console.error('QR rendering error:', err);
    }
  }, [
    config.qr.dataUrl,
    config.qr.size,
    config.qr.dotColor,
    config.qr.bgColor,
    config.qr.useCardAccentForQR,
    config.qr.dotPattern,
    config.qr.eyeStyle,
    config.qr.logoUrl,
    config.back.showSecondaryQR,
    config.styles.accentColor,
    config.styles.textColor,
  ]);

  // Mouse 3D tilt handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // CORRECT 3D FLIP MATHEMATICS (Stays flipped to 180deg when isFlipped is true!)
  const baseRotationY = isFlipped ? 180 : 0;
  const currentRotateY = baseRotationY + (isHovered ? rotateY : 0);
  const currentRotateX = isHovered ? rotateX : 0;

  // Dynamic Background & Material Finishes
  const getCardBackground = () => {
    if (config.styles.material === 'claymorphic') {
      return config.styles.bgType === 'gradient'
        ? `linear-gradient(135deg, ${config.styles.bgColor1}, ${config.styles.bgColor2})`
        : config.styles.bgColor1 || '#ffffff';
    }
    if (config.styles.material === 'neobrutalism') {
      return config.styles.bgColor1 || '#fef08a';
    }
    if (config.styles.material === 'maximalism') {
      return `linear-gradient(135deg, #ff007f 0%, #7928ca 50%, #4338ca 100%)`;
    }
    if (config.styles.material === 'frosted-glass') {
      return `rgba(255, 255, 255, 0.25)`;
    }
    if (config.styles.material === 'cyber-neon') {
      return `linear-gradient(135deg, #09090b 0%, #18181b 100%)`;
    }
    if (config.styles.material === 'holographic') {
      return `linear-gradient(135deg, #ec4899 0%, #8b5cf6 33%, #3b82f6 66%, #06b6d4 100%)`;
    }
    if (config.styles.material === 'gold-foil') {
      return `linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)`;
    }
    if (config.styles.material === 'kraft-paper') {
      return `#d7c4b7`;
    }
    if (config.styles.material === 'brushed-metal') {
      return `linear-gradient(135deg, #334155 0%, #1e293b 50%, #475569 100%)`;
    }
    if (config.styles.material === 'royal-velvet') {
      return `linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)`;
    }
    if (config.styles.material === 'monochrome-serif') {
      return `#0f172a`;
    }
    if (config.styles.material === 'nordic-ice') {
      return `linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)`;
    }
    if (config.styles.bgType === 'gradient') {
      return `linear-gradient(135deg, ${config.styles.bgColor1}, ${config.styles.bgColor2})`;
    }
    return config.styles.bgColor1;
  };

  const getBorderStyles = () => {
    if (config.styles.material === 'neobrutalism') {
      return '4px solid #000000';
    }
    if (config.styles.material === 'cyber-neon') {
      return '2px solid #06b6d4';
    }
    if (config.styles.material === 'royal-velvet') {
      return '2px solid #c084fc';
    }
    if (config.styles.material === 'frosted-glass') {
      return '1.5px solid rgba(255, 255, 255, 0.6)';
    }
    if (config.styles.material === 'claymorphic') {
      return '1px solid rgba(255, 255, 255, 0.9)';
    }
    if (config.styles.borderStyle === 'gold-border') {
      return '2px solid #d4af37';
    }
    if (config.styles.borderStyle === 'double') {
      return `4px double ${config.styles.accentColor}`;
    }
    if (config.styles.borderStyle === 'dashed') {
      return `2px dashed ${config.styles.accentColor}`;
    }
    if (config.styles.borderStyle === 'glowing') {
      return `2px solid ${config.styles.accentColor}`;
    }
    if (config.styles.borderStyle === 'solid') {
      return `1px solid ${config.styles.accentColor}40`;
    }
    return '1px solid rgba(255, 255, 255, 0.2)';
  };

  const getCardBoxShadow = () => {
    if (config.styles.material === 'neobrutalism') {
      return '8px 8px 0px #000000';
    }
    if (config.styles.material === 'claymorphic') {
      return isHovered
        ? '14px 22px 36px -6px rgba(15, 23, 42, 0.16), -10px -10px 24px rgba(255, 255, 255, 1), inset 0px 3px 6px rgba(255, 255, 255, 0.95)'
        : '10px 16px 28px -6px rgba(15, 23, 42, 0.12), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 0px 2px 4px rgba(255, 255, 255, 0.9)';
    }
    if (config.styles.material === 'cyber-neon') {
      return '0 0 25px rgba(6, 182, 212, 0.5), inset 0 0 15px rgba(6, 182, 212, 0.2)';
    }
    if (config.styles.material === 'royal-velvet') {
      return '0 15px 35px rgba(124, 58, 237, 0.35)';
    }
    if (config.styles.material === 'frosted-glass') {
      return '0 8px 32px rgba(31, 38, 135, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.6)';
    }
    return isHovered
      ? '0 30px 60px -15px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 255, 255, 0.2)'
      : '0 20px 35px -10px rgba(0, 0, 0, 0.25)';
  };

  const getCardShapeStyle = (): { borderRadius?: string; clipPath?: string } => {
    const shape = config.styles.cardShape || 'rounded';
    if (shape === 'pill') {
      return { borderRadius: '36px' };
    }
    if (shape === 'sharp') {
      return { borderRadius: '4px' };
    }
    if (shape === 'arch') {
      return { borderRadius: '48px 48px 12px 12px' };
    }
    if (shape === 'chamfer') {
      return {
        borderRadius: '0px',
        clipPath: 'polygon(18px 0%, calc(100% - 18px) 0%, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0% calc(100% - 18px), 0% 18px)',
      };
    }
    return { borderRadius: `${config.styles.borderRadius || 20}px` };
  };

  const shapeStyle = getCardShapeStyle();

  return (
    <div
      className={clsx('relative select-none cursor-pointer perspective-1000', className)}
      style={{
        width: width * scale,
        height: height * scale,
        perspective: '1200px',
      }}
      onClick={onFlip}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="w-full h-full relative transition-transform duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg)`,
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FRONT SIDE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          id="card-front-side"
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            backfaceVisibility: 'hidden',
            borderRadius: shapeStyle.borderRadius,
            clipPath: shapeStyle.clipPath,
            background: getCardBackground(),
            color: config.styles.textColor,
            fontFamily: config.styles.fontFamily,
            border: getBorderStyles(),
            boxShadow: getCardBoxShadow(),
          }}
        >
          {/* Finishes & Overlays */}
          {(config.styles.material === 'glossy-glass' || config.styles.material === 'frosted-glass') && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-none" />
          )}

          {/* Pattern Overlays */}
          {config.styles.pattern === 'dots' && (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${config.styles.textColor} 1.5px, transparent 1.5px)`,
                backgroundSize: '14px 14px',
              }}
            />
          )}
          {config.styles.pattern === 'waves' && (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${config.styles.textColor} 0, ${config.styles.textColor} 1px, transparent 0, transparent 12px)`,
              }}
            />
          )}
          {config.styles.pattern === 'grid' && (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"
            />
          )}

          {/* Optional Badge Banner */}
          {config.front.showBadge && config.front.badgeText && (
            <div className="absolute top-4 right-4 z-20">
              <span
                className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
                style={{ backgroundColor: config.styles.accentColor, color: '#ffffff' }}
              >
                <Sparkles className="w-3 h-3" />
                {config.front.badgeText}
              </span>
            </div>
          )}

          {/* FRONT PORTRAIT & SQUARE LAYOUT */}
          {isPortrait || isSquare ? (
            <div className="h-full flex flex-col justify-between p-6 relative z-10 text-center">
              {/* Header Info */}
              <div className="flex flex-col items-center pt-2">
                {config.front.showAvatar && config.front.avatarUrl && (
                  <div
                    className={clsx(
                      'overflow-hidden mb-3 p-1 ring-2 ring-white/30 shadow-lg',
                      config.front.avatarShape === 'circle' ? 'w-16 h-16 rounded-full' : config.front.avatarShape === 'rounded' ? 'w-16 h-16 rounded-2xl' : 'w-16 h-16 rounded-lg'
                    )}
                  >
                    <img src={config.front.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  </div>
                )}
                {config.front.headerTitle && (
                  <h3
                    className={clsx('font-bold leading-tight mb-0.5', config.front.scriptFont ? 'text-3.5xl font-normal' : 'text-xl')}
                    style={{
                      fontFamily: config.front.scriptFont ? "'Dancing Script', cursive" : config.styles.fontFamily,
                      color: config.styles.textColor,
                    }}
                  >
                    {config.front.headerTitle}
                  </h3>
                )}
                {config.front.headerSubtitle && (
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-80">
                    {config.front.headerSubtitle}
                  </p>
                )}
              </div>

              {/* Center QR Code Container with Frame Text */}
              {config.front.showQR && (
                <div className="my-auto flex flex-col items-center">
                  <div
                    className="p-3 rounded-2xl shadow-xl backdrop-blur-md transition-transform hover:scale-105 relative border border-white/20"
                    style={{ backgroundColor: config.qr.bgColor || 'rgba(255, 255, 255, 0.95)' }}
                  >
                    {config.qr.showFrameText && config.qr.frameText && (
                      <div
                        className="text-[9px] font-extrabold uppercase tracking-wider py-0.5 px-2 text-center mb-1 rounded"
                        style={{ backgroundColor: config.styles.accentColor, color: '#fff' }}
                      >
                        {config.qr.frameText}
                      </div>
                    )}
                    <div ref={frontQrRef} className="flex items-center justify-center overflow-hidden" />
                  </div>
                  {config.front.qrLabel && (
                    <p className="text-[11px] font-medium mt-2 opacity-85 tracking-wide">
                      {config.front.qrLabel}
                    </p>
                  )}
                </div>
              )}

              {/* Footer Contact Details & Social Handles */}
              <div className="space-y-1 text-xs opacity-90 font-medium">
                {config.front.showPhone && config.front.phone && (
                  <div className="flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" style={{ color: config.styles.accentColor }} />
                    <span>{config.front.phone}</span>
                  </div>
                )}
                {config.front.showEmail && config.front.email && (
                  <div className="flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" style={{ color: config.styles.accentColor }} />
                    <span>{config.front.email}</span>
                  </div>
                )}
                {config.front.showWebsite && config.front.website && (
                  <div className="flex items-center justify-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" style={{ color: config.styles.accentColor }} />
                    <span>{config.front.website}</span>
                  </div>
                )}
                {config.front.showSocials && (
                  <div className="flex items-center justify-center gap-3 pt-1">
                    {config.front.instagram && <InstagramIcon className="w-3.5 h-3.5" />}
                    {config.front.facebook && <FacebookIcon className="w-3.5 h-3.5" />}
                    {config.front.twitter && <TwitterIcon className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* FRONT LANDSCAPE LAYOUT */
            <div className="h-full flex items-center justify-between p-7 relative z-10">
              <div className="flex-1 pr-6 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3">
                  {config.front.showAvatar && config.front.avatarUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30 shadow">
                      <img src={config.front.avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3
                      className={clsx('font-bold leading-tight', config.front.scriptFont ? 'text-2.5xl font-normal' : 'text-lg')}
                      style={{ fontFamily: config.front.scriptFont ? "'Dancing Script', cursive" : config.styles.fontFamily }}
                    >
                      {config.front.headerTitle}
                    </h3>
                    <p className="text-xs uppercase tracking-wider opacity-80 font-medium">{config.front.headerSubtitle}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs opacity-90 font-medium">
                  {config.front.showPhone && config.front.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" style={{ color: config.styles.accentColor }} />
                      <span>{config.front.phone}</span>
                    </div>
                  )}
                  {config.front.showEmail && config.front.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" style={{ color: config.styles.accentColor }} />
                      <span>{config.front.email}</span>
                    </div>
                  )}
                  {config.front.showWebsite && config.front.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" style={{ color: config.styles.accentColor }} />
                      <span>{config.front.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {config.front.showQR && (
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="p-2.5 rounded-xl shadow-lg backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: config.qr.bgColor || 'rgba(255, 255, 255, 0.95)' }}
                  >
                    <div ref={frontQrRef} className="flex items-center justify-center overflow-hidden" />
                  </div>
                  {config.front.qrLabel && (
                    <p className="text-[10px] font-medium mt-1.5 opacity-80 tracking-wide text-center">
                      {config.front.qrLabel}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BACK SIDE (GREETINGS, STAMPS, COUPONS & WIFI) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div
          id="card-back-side"
          className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: shapeStyle.borderRadius,
            clipPath: shapeStyle.clipPath,
            background: getCardBackground(),
            color: config.styles.textColor,
            fontFamily: config.styles.fontFamily,
            border: getBorderStyles(),
          }}
        >
          <div className="h-full flex flex-col items-center justify-between p-6 text-center relative z-10">
            {/* Top Brand Logo & Tagline */}
            <div className="flex flex-col items-center">
              {config.back.showLogo && config.back.logoUrl && (
                <div className="w-14 h-14 rounded-2xl overflow-hidden mb-2 p-1.5 bg-white/10 backdrop-blur-sm shadow-inner flex items-center justify-center">
                  <img src={config.back.logoUrl} alt="Back Logo" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <h2 className="text-xl font-bold tracking-wide" style={{ color: config.styles.accentColor }}>
                {config.back.brandName || config.front.headerTitle}
              </h2>
              {config.back.tagline && (
                <p className="text-[11px] uppercase tracking-widest opacity-80 mt-0.5">
                  {config.back.tagline}
                </p>
              )}
            </div>

            {/* BACK SIDE LAYOUT TYPES */}
            {/* 1. GREETING & THANK YOU CARD */}
            {config.back.layout === 'greeting' && (
              <div className="my-auto space-y-2 max-w-xs">
                {config.back.greetingTitle && (
                  <h4 className="text-2.5xl font-bold" style={{ fontFamily: "'Dancing Script', cursive", color: config.styles.accentColor }}>
                    {config.back.greetingTitle}
                  </h4>
                )}
                {config.back.greetingBody && (
                  <p className="text-xs opacity-90 leading-relaxed px-2">
                    {config.back.greetingBody}
                  </p>
                )}
                {config.back.showCoupon && config.back.couponCode && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-xs font-mono font-bold tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>VOUCHER: {config.back.couponCode}</span>
                  </div>
                )}
              </div>
            )}

            {/* 2. LOYALTY STAMP CARD LAYOUT */}
            {config.back.layout === 'loyalty-stamp' && (
              <div className="my-auto space-y-2 w-full max-w-xs">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Award className="w-4 h-4" /> Loyalty Rewards Card
                </div>
                <p className="text-[11px] opacity-85 font-medium">{config.back.loyaltyRewardText || 'Collect stamps to unlock rewards!'}</p>

                <div className={clsx('grid gap-2 my-2 px-2', (config.back.loyaltyStampsCount || 5) === 10 ? 'grid-cols-5' : 'grid-cols-5')}>
                  {Array.from({ length: config.back.loyaltyStampsCount || 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl border border-white/30 bg-white/10 flex items-center justify-center text-xs font-bold shadow-inner"
                    >
                      {i === 0 ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. WIFI CARD LAYOUT */}
            {config.back.layout === 'wifi-card' && (
              <div className="my-auto space-y-2 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-xs shadow-lg">
                <div className="flex items-center justify-center gap-2 text-sm font-bold">
                  <Wifi className="w-4 h-4" style={{ color: config.styles.accentColor }} /> Customer WiFi Access
                </div>
                {config.back.wifiName && (
                  <p className="text-xs font-mono">SSID: <strong>{config.back.wifiName}</strong></p>
                )}
                {config.back.wifiPass && (
                  <p className="text-xs font-mono opacity-90">Password: <strong>{config.back.wifiPass}</strong></p>
                )}
              </div>
            )}

            {/* 4. BUSINESS HOURS LAYOUT */}
            {config.back.layout === 'business-hours' && (
              <div className="my-auto space-y-2 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-xs">
                <div className="flex items-center justify-center gap-2 text-sm font-bold mb-1">
                  <Clock className="w-4 h-4" style={{ color: config.styles.accentColor }} /> Business Hours
                </div>
                <p className="text-xs opacity-90 font-medium leading-relaxed">
                  {config.back.businessHours || 'Mon - Sat: 9:00 AM - 8:00 PM\nSun: Closed'}
                </p>
              </div>
            )}

            {/* 5. SOCIAL GRID & SECONDARY QR */}
            {config.back.layout === 'social-grid' && (
              <div className="my-auto space-y-2">
                {config.back.showSecondaryQR && (
                  <div className="p-2 rounded-xl bg-white/95 shadow-md inline-block">
                    <div ref={backQrRef} className="flex items-center justify-center" />
                  </div>
                )}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <InstagramIcon className="w-5 h-5" />
                  <FacebookIcon className="w-5 h-5" />
                  <TwitterIcon className="w-5 h-5" />
                </div>
              </div>
            )}

            {/* Bottom Footer */}
            <div className="text-[10px] opacity-75 tracking-wider uppercase pt-1 font-semibold">
              StoreFront Digital Experience
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
