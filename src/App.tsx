import { useState, useEffect, Suspense, lazy } from 'react';
import type { UserRole } from './data';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import './index.css';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SessionsPage = lazy(() => import('./pages/SessionsPage'));
const LogsPage = lazy(() => import('./pages/LogsPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('role');
    return saved ? (saved as UserRole) : null;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('username') || '');
  const [page, setPageState] = useState(() => {
    const hash = window.location.hash.slice(1);
    const validPages = ['home', 'login', 'admin', 'sessions', 'logs', 'map', 'insights', 'dashboard'];
    return validPages.includes(hash) ? hash : 'home';
  });

  const setPage = (newPage: string) => {
    window.location.hash = newPage;
    setPageState(newPage);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const validPages = ['home', 'login', 'admin', 'sessions', 'logs', 'map', 'insights', 'dashboard'];
      if (validPages.includes(hash)) setPageState(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (r: UserRole, name: string) => {
    setRole(r);
    setUserName(name);
    if (r) localStorage.setItem('role', r);
    localStorage.setItem('username', name);
    setPage('insights');
  };

  const handleLogout = () => {
    setRole(null);
    setUserName('');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setPage('home');
  };

  const currentPage = () => {
    if (page === 'home') return <LandingPage onNavigate={setPage} />;
    if (page === 'login') return <LoginPage onLogin={handleLogin} />;
    if (page === 'admin' && role === 'admin') return <AdminPage />;
    if (page === 'sessions') return <SessionsPage />;
    if (page === 'logs') return <LogsPage role={role} />;
    if (page === 'map') return <MapPage />;
    return <DashboardPage role={role} onNavigate={setPage} />;
  };

  useEffect(() => {
    // Initial loading screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-vp-bg flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-t-4 border-vp-cyan rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-vp-cyan/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-b-4 border-vp-cyan/30 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        <h2 className="text-vp-cyan text-xl font-bold tracking-widest animate-pulse">VERDE<span className="text-white">PLUS</span></h2>
        <p className="text-vp-muted text-sm mt-2">جاري تهيئة النظام والمؤشرات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-vp-bg text-white font-inter flex flex-col">
      {/* Global Mesh Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {page !== 'login' && page !== 'home' && (
        <Navbar
          role={role}
          name={userName}
          activePage={page}
          onNavigate={setPage}
          onLogout={handleLogout}
        />
      )}
      <main className="z-10 relative flex-1 flex flex-col">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center p-12 text-vp-cyan animate-pulse">جاري التحميل...</div>}>
          {currentPage()}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
