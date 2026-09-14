// ─── Reusable Claymorphism 3D UI Components ─────────────────────────────────
import { forwardRef, useState, useEffect, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Loader2, ImagePlus, ChevronDown, AlertTriangle, Info, Check } from 'lucide-react';
import { clsx } from 'clsx';

// ═══════════════════════════════════════════════════════════════════════════
// BUTTON
// ═══════════════════════════════════════════════════════════════════════════
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/30 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] select-none';
    
    const variants = {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-[0_10px_22px_-4px_rgba(37,99,235,0.42),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-4px_rgba(37,99,235,0.5)] active:translate-y-0.5',
      secondary: 'bg-white text-slate-800 rounded-full shadow-[6px_6px_14px_rgba(148,163,184,0.15),-6px_-6px_14px_rgba(255,255,255,0.95),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-slate-200/80 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0.5',
      ghost: 'text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-full hover:shadow-[4px_4px_10px_rgba(148,163,184,0.12),-4px_-4px_10px_rgba(255,255,255,0.9)]',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full shadow-[0_10px_22px_-4px_rgba(239,68,68,0.4),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0.5',
      success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-[0_10px_22px_-4px_rgba(16,185,129,0.4),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 active:translate-y-0.5',
    };
    
    const sizes = {
      sm: 'h-9 px-4 text-xs gap-1.5',
      md: 'h-11 px-5 text-sm gap-2',
      lg: 'h-13 px-7 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════════════════════════
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full h-11 px-4 rounded-2xl bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-400 transition-all duration-200',
              'shadow-[inset_3px_3px_6px_rgba(148,163,184,0.18),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]',
              'border border-slate-200/80',
              'focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15',
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/15' : '',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ═══════════════════════════════════════════════════════════════════════════
// TEXTAREA
// ═══════════════════════════════════════════════════════════════════════════
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-2xl bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-400 transition-all duration-200 resize-none',
            'shadow-[inset_3px_3px_6px_rgba(148,163,184,0.18),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]',
            'border border-slate-200/80',
            'focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15',
            error ? 'border-red-400' : '',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ═══════════════════════════════════════════════════════════════════════════
// SELECT (Custom Animated 3D Popover Dropdown)
// ═══════════════════════════════════════════════════════════════════════════
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, value, onChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => String(o.value) === String(value)) || options[0];

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
      setIsOpen(false);
      if (onChange) {
        const synthEvent = {
          target: { value: val, name: props.name },
          currentTarget: { value: val, name: props.name },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(synthEvent);
      }
    };

    return (
      <div className="space-y-1.5" ref={containerRef}>
        {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>}
        
        {/* Hidden select for standard ref & form integration */}
        <select ref={ref} value={value} onChange={onChange} className="hidden" disabled={disabled} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Custom Clay 3D Dropdown Trigger Button */}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={clsx(
              'w-full h-11 px-4 rounded-2xl bg-slate-50/80 text-slate-800 text-sm font-semibold flex items-center justify-between transition-all duration-200 select-none cursor-pointer',
              'shadow-[inset_3px_3px_6px_rgba(148,163,184,0.18),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]',
              'border border-slate-200/80 hover:bg-white',
              isOpen && 'border-blue-500 ring-4 ring-blue-500/15 bg-white shadow-none',
              error && 'border-red-400',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
          >
            <span className="truncate">{selectedOption?.label || 'Select option...'}</span>
            <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2', isOpen && 'rotate-180 text-blue-600')} />
          </button>

          {/* Floating 3D Popover Options List */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-[0_16px_36px_-6px_rgba(15,23,42,0.18),-6px_-6px_16px_rgba(255,255,255,0.9)] border border-slate-100 p-1.5 z-50 max-h-60 overflow-y-auto"
              >
                {options.map((option) => {
                  const isSelected = String(option.value) === String(value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={clsx(
                        'w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors text-left',
                        isSelected
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

// ═══════════════════════════════════════════════════════════════════════════
// TOGGLE / SWITCH
// ═══════════════════════════════════════════════════════════════════════════
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative w-12 h-7 rounded-full transition-all duration-300 p-0.5',
          checked
            ? 'bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]'
            : 'bg-slate-200 shadow-[inset_2px_2px_5px_rgba(148,163,184,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]'
        )}
      >
        <span
          className={clsx(
            'block w-6 h-6 rounded-full bg-white transition-transform duration-300',
            'shadow-[2px_2px_5px_rgba(0,0,0,0.15)]',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {label && <span className="text-sm font-semibold text-slate-700">{label}</span>}
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BADGE / CHIP
// ═══════════════════════════════════════════════════════════════════════════
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const colors = {
    default: 'bg-white text-slate-700 shadow-[3px_3px_8px_rgba(148,163,184,0.12),-3px_-3px_8px_rgba(255,255,255,0.9)] border border-slate-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-[3px_3px_8px_rgba(16,185,129,0.1)]',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60 shadow-[3px_3px_8px_rgba(245,158,11,0.1)]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60 shadow-[3px_3px_8px_rgba(244,63,94,0.1)]',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/60 shadow-[3px_3px_8px_rgba(14,165,233,0.1)]',
    brand: 'bg-blue-50 text-blue-700 border border-blue-200/60 shadow-[3px_3px_8px_rgba(37,99,235,0.1)]',
  };
  const sizes = { sm: 'px-2.5 py-1 text-xs rounded-full', md: 'px-3 py-1 text-xs font-semibold rounded-full' };

  return (
    <span className={clsx('inline-flex items-center font-medium shadow-sm', colors[variant], sizes[size])}>
      {children}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLAY 3D CARD
// ═══════════════════════════════════════════════════════════════════════════
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, hover = false, padding = 'md', onClick }: CardProps) {
  const paddings = { none: '', sm: 'p-3.5', md: 'p-6', lg: 'p-8' };
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-[28px]',
        'shadow-[10px_16px_28px_-6px_rgba(15,23,42,0.07),-8px_-8px_20px_rgba(255,255,255,0.95),inset_0px_2px_4px_rgba(255,255,255,0.9)]',
        'border border-white/80 transition-all duration-300',
        hover && 'hover:-translate-y-1.5 hover:shadow-[14px_22px_36px_-8px_rgba(15,23,42,0.12),-10px_-10px_24px_rgba(255,255,255,1)] cursor-pointer',
        paddings[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLAY 3D MODAL
// ═══════════════════════════════════════════════════════════════════════════
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-[90vw]' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              'relative w-full bg-white rounded-[32px] overflow-hidden z-10',
              'shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)]',
              'border border-white/80',
              sizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                <h2 className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="max-h-[80vh] overflow-y-auto p-7">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CLAY 3D DRAWER
// ═══════════════════════════════════════════════════════════════════════════
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[36px] max-h-[90vh] overflow-hidden shadow-2xl border-t border-white/80"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>
            {title && (
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              </div>
            )}
            <div className="overflow-y-auto max-h-[80vh] px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'skeleton',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 rounded-xl',
        className
      )}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-[28px] shadow-[10px_16px_28px_-6px_rgba(15,23,42,0.06),-8px_-8px_20px_rgba(255,255,255,0.95)] border border-white/80 max-w-lg mx-auto"
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-[4px_4px_10px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR STATE
// ═══════════════════════════════════════════════════════════════════════════
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-[28px] shadow-lg border border-red-100 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
      {message && <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>}
      {onRetry && <Button variant="secondary" onClick={onRetry} size="sm">Try Again</Button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toasts: ToastData[] = [];

function notify() {
  toastListeners.forEach((l) => l([...toasts]));
}

export function toast(type: ToastType, message: string) {
  const id = Math.random().toString(36).slice(2);
  toasts.push({ id, type, message });
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

toast.success = (msg: string) => toast('success', msg);
toast.error = (msg: string) => toast('error', msg);
toast.info = (msg: string) => toast('info', msg);
toast.warning = (msg: string) => toast('warning', msg);
toast.loading = (msg: string) => toast('info', msg);
toast.dismiss = () => { toasts = []; notify(); };

export function ToastContainer() {
  const [items, setItems] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.push(setItems);
    return () => { toastListeners = toastListeners.filter((l) => l !== setItems); };
  }, []);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.92 }}
            className="flex items-center gap-3.5 px-5 py-3.5 bg-white rounded-2xl shadow-[10px_16px_28px_-6px_rgba(15,23,42,0.12),-6px_-6px_16px_rgba(255,255,255,0.9)] border border-white/80 pointer-events-auto min-w-[300px]"
          >
            {icons[t.type]}
            <span className="text-sm font-semibold text-slate-800">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD
// ═══════════════════════════════════════════════════════════════════════════
interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => void;
  label?: string;
  className?: string;
  aspect?: 'square' | 'banner' | 'free';
}

export function ImageUpload({ value, onChange, label, className, aspect = 'square' }: ImageUploadProps) {
  const aspects = { square: 'aspect-square', banner: 'aspect-[3/1]', free: 'aspect-[4/3]' };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>}
      <label
        className={clsx(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200',
          'hover:border-blue-400 hover:bg-blue-50/40',
          value ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 bg-slate-50/60 shadow-[inset_2px_2px_5px_rgba(148,163,184,0.15)]',
          aspects[aspect],
          className
        )}
      >
        {value ? (
          <img src={value} alt="Upload" className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImagePlus className="w-8 h-8" />
            <span className="text-xs font-semibold">Click to upload image</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
      </label>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════════════════════════════════════════
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger', loading }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="p-2 text-center">
        <div className={clsx('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm',
          variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
        )}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════════════
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-9 h-9 text-blue-600" />
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE HEADER
// ═══════════════════════════════════════════════════════════════════════════
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {title}
        </h1>
        {description && <p className="text-sm font-medium text-slate-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
