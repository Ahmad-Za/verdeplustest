import { useState } from 'react';
import type { UserRole } from './data';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import SessionsPage from './pages/SessionsPage';
import LogsPage from './pages/LogsPage';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState('');
  const [page, setPage] = useState('home');

  const handleLogin = (r: UserRole, name: string) => {
    setRole(r);
    setUserName(name);
    setPage('insights');
  };

  const handleLogout = () => {
    setRole(null);
    setUserName('');
    setPage('insights');
  };

  const currentPage = () => {
    if (page === 'home') return <LandingPage onNavigate={setPage} />;
    if (page === 'login') return <LoginPage onLogin={handleLogin} />;
    if (page === 'admin' && role === 'admin') return <AdminPage />;
    if (page === 'sessions') return <SessionsPage />;
    if (page === 'logs') return <LogsPage role={role} />;
    return <DashboardPage role={role} onNavigate={setPage} />;
  };

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
      <main className="z-10 relative flex-1 flex flex-col">{currentPage()}</main>
      <Footer />
    </div>
  );
}
