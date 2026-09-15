import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, User, Eye, EyeOff, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function RegisterPage() {
  const { register, loginWithGoogle, loginAsDemoUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(email, password, name);
      navigate('/onboarding');
    } catch {}
    setSubmitting(false);
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate('/onboarding');
    } catch {}
  };

  const handleDemoLogin = async () => {
    setSubmitting(true);
    try {
      await loginAsDemoUser();
      navigate('/dashboard');
    } catch {}
    setSubmitting(false);
  };

  const isUnauthorizedDomain = error?.includes('Unauthorized Domain');

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-premium relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(92,124,250,0.2),transparent_60%)]" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Start for free</h2>
          <p className="text-surface-400 text-sm max-w-sm">
            Create your digital storefront in minutes. No credit card required.
          </p>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">StoreFront</span>
          </div>

          <h1 className="text-2xl font-bold text-surface-900 mb-1">Create your account</h1>
          <p className="text-sm text-surface-500 mb-8">Get started with your digital storefront</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "rounded-xl px-4 py-3 mb-6 text-xs text-left",
                isUnauthorizedDomain
                  ? "bg-amber-50 border border-amber-300 text-amber-950"
                  : "bg-red-50 border border-red-100 text-red-700"
              )}
            >
              {isUnauthorizedDomain ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-red-800 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>Firebase Auth: Domain Not Authorized</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    Google OAuth popup requires adding your Vercel domain (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">{window.location.hostname}</code>) to Firebase Authorized Domains list:
                  </p>
                  <ol className="list-decimal list-inside text-[10px] text-slate-700 space-y-1 pl-1 font-medium">
                    <li>Go to <strong className="text-slate-900">Firebase Console</strong> → <strong className="text-slate-900">Authentication</strong> → <strong className="text-slate-900">Settings</strong> → <strong className="text-slate-900">Authorized Domains</strong>.</li>
                    <li>Click <strong className="text-slate-900">Add domain</strong> and paste: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900 font-bold">{window.location.hostname}</code></li>
                  </ol>
                  <div className="pt-2 border-t border-amber-200/80">
                    <button
                      onClick={handleDemoLogin}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Use 1-Click Demo Owner Sign In
                    </button>
                  </div>
                </div>
              ) : (
                error
              )}
            </motion.div>
          )}

          <button onClick={handleGoogle} className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white hover:bg-surface-50 text-sm font-medium transition-all duration-200 mb-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6"><div className="flex-1 h-px bg-surface-200" /><span className="text-xs text-surface-400">or</span><div className="flex-1 h-px bg-surface-200" /></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => { setName(e.target.value); clearError(); }} icon={<User className="w-4 h-4" />} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} icon={<Mail className="w-4 h-4" />} required />
            <div className="relative">
              <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} icon={<Lock className="w-4 h-4" />} required minLength={6} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" loading={submitting}>Create Account</Button>
          </form>

          <p className="text-sm text-surface-500 text-center mt-6">
            Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
