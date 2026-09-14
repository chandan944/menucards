// ─── App Router ─────────────────────────────────────────────────────────────
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { FullscreenProvider, FullscreenButton } from '@/contexts/FullscreenContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LoadingScreen, ToastContainer } from '@/components/ui';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
const OffersPage = lazy(() => import('@/pages/OffersPage'));
const AppearancePage = lazy(() => import('@/pages/AppearancePage'));
const QRStudioPage = lazy(() => import('@/pages/QRStudioPage'));
const CardStudioPage = lazy(() => import('@/pages/CardStudioPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const StorefrontPage = lazy(() => import('@/pages/StorefrontPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <FullscreenProvider>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/s/:slug" element={<StorefrontPage />} />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="offers" element={<OffersPage />} />
                <Route path="appearance" element={<AppearancePage />} />
                <Route path="qr-studio" element={<QRStudioPage />} />
                <Route path="card-studio" element={<CardStudioPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
                  <div className="text-6xl mb-4">🔮</div>
                  <h1 className="text-3xl font-bold text-surface-900 mb-2">Page not found</h1>
                  <p className="text-surface-500 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="text-brand-600 font-medium hover:underline">Go home</a>
                </div>
              } />
            </Routes>
          </Suspense>
          <ToastContainer />
          
          {/* Floating Fullscreen button for quick access across all pages */}
          <div className="fixed bottom-4 right-4 z-50">
            <FullscreenButton className="bg-white/80 backdrop-blur border border-surface-200 shadow-md hover:shadow-lg hover:bg-white text-surface-700" />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </FullscreenProvider>
  );
}
