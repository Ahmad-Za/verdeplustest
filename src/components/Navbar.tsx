import { useState } from 'react';
import type { UserRole } from '../data';
import { useI18n } from '../i18n';

interface NavbarProps {
    role: UserRole;
    name: string;
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export default function Navbar({ role, name, activePage, onNavigate, onLogout }: NavbarProps) {
    const { t, lang, setLang } = useI18n();
    const [menuOpen, setMenuOpen] = useState(false);
    const adminLinks = [
        { id: 'home', label: t('nav.home') },
        { id: 'insights', label: t('nav.insights') },
        { id: 'logs', label: t('nav.logs') || 'السجلات' },
        { id: 'admin', label: t('nav.admin') },
        { id: 'sessions', label: t('nav.sessions') },
    ];
    const researcherLinks = [
        { id: 'home', label: t('nav.home') },
        { id: 'insights', label: t('nav.insights') },
        { id: 'logs', label: t('nav.logs') || 'السجلات' },
        { id: 'sessions', label: t('nav.sessions') },
    ];
    const links = role === 'admin' ? adminLinks : researcherLinks;

    return (
        <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    onClick={() => onNavigate('home')}
                >
                    <img src="/verdeplus cyan.png" alt="VerdePlus" className="h-16 md:h-20 object-contain drop-shadow-lg" />
                    {role === 'researcher' && (
                        <span className="text-xs bg-vp-cyan/10 text-vp-cyan border border-vp-cyan/20 rounded-full px-2 py-0.5 mr-1 hidden sm:inline-block">Premium</span>
                    )}
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map(link => (
                        <button
                            key={link.id}
                            onClick={() => { onNavigate(link.id); setMenuOpen(false); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activePage === link.id
                                ? 'bg-vp-cyan/10 text-vp-cyan border border-vp-cyan/20'
                                : 'text-vp-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* User & Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                        className="text-vp-muted hover:text-white px-2 py-1 text-sm font-bold border border-white/10 rounded transition-colors"
                    >
                        {lang === 'ar' ? 'EN' : 'عربي'}
                    </button>
                    <div className="text-right hidden sm:block px-3 border-x border-white/10 ml-2">
                        <p className="text-sm font-semibold">{name || t('nav.guest')}</p>
                        <p className="text-xs text-vp-muted capitalize">{role === 'admin' ? t('nav.admin_role') : role === 'researcher' ? t('nav.researcher_role') : t('nav.user_role')}</p>
                    </div>
                    {role ? (
                        <button onClick={onLogout} className="secondary-btn text-sm py-2 px-4 transition-transform hover:scale-105">
                            {t('nav.logout')}
                        </button>
                    ) : (
                        <button onClick={() => onNavigate('login')} className="neon-btn text-sm py-2 px-4 transition-transform hover:scale-105">
                            {t('nav.login')}
                        </button>
                    )}

                    {/* Hamburger button (Mobile) */}
                    <button
                        className="md:hidden p-2 text-vp-muted hover:text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 animate-fade-in">
                    {links.map(link => (
                        <button
                            key={link.id}
                            onClick={() => { onNavigate(link.id); setMenuOpen(false); }}
                            className={`px-4 py-3 rounded-lg text-sm font-medium w-full text-start ${activePage === link.id
                                ? 'bg-vp-cyan/10 text-vp-cyan border border-vp-cyan/20'
                                : 'text-vp-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    {!role && (
                        <button onClick={() => { onNavigate('login'); setMenuOpen(false); }} className="neon-btn text-sm py-3 mt-2 w-full">
                            {t('nav.login')}
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}

