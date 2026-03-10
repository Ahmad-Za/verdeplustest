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
    const adminLinks = [
        { id: 'home', label: t('nav.home') },
        { id: 'insights', label: t('nav.insights') },
        { id: 'map', label: t('nav.map') || 'خارطة الاجهزة' },
        { id: 'logs', label: t('nav.logs') || 'بنك البيانات' },
        { id: 'admin', label: t('nav.admin') },
        { id: 'sessions', label: t('nav.sessions') },
    ];
    const researcherLinks = [
        { id: 'home', label: t('nav.home') },
        { id: 'insights', label: t('nav.insights') },
        { id: 'map', label: t('nav.map') || 'خارطة الاجهزة' },
        { id: 'logs', label: t('nav.logs') || 'بنك البيانات' },
        { id: 'sessions', label: t('nav.sessions') },
    ];
    const links = role === 'admin' ? adminLinks : researcherLinks;

    return (
        <>
            <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => onNavigate('home')}
                    >
                        <img src="/verdeplus cyan.png" alt="VerdePlus" className="h-16 md:h-20 object-contain drop-shadow-lg" />
                        {role === 'researcher' && (
                            <span className="text-xs bg-vp-cyan/10 text-vp-cyan border border-vp-cyan/20 rounded-full px-2 py-0.5 mr-1 hidden sm:inline-block whitespace-nowrap">{t('nav.researcher_role')}</span>
                        )}
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <button
                                key={link.id}
                                onClick={() => { onNavigate(link.id); }}
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
                            <button onClick={onLogout} className="secondary-btn text-xs md:text-sm py-1.5 px-3 md:py-2 md:px-4 transition-transform hover:scale-105">
                                {t('nav.logout')}
                            </button>
                        ) : (
                            <button onClick={() => onNavigate('login')} className="neon-btn text-xs md:text-sm py-1.5 px-3 md:py-2 md:px-4 transition-transform hover:scale-105">
                                {t('nav.login')}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Mobile Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-vp-bg/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around pb-4 pt-2 px-1 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {links.map(link => {
                    const isActive = activePage === link.id;
                    let path = "";
                    if (link.id === 'home') path = "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";
                    else if (link.id === 'insights') path = "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";
                    else if (link.id === 'logs') path = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01";
                    else if (link.id === 'admin') path = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z";
                    else if (link.id === 'sessions') path = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
                    else if (link.id === 'map') path = "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-2.25 5.447 2.724A1 1 0 0121 8.382v10.782a1 1 0 01-1.447.894L15 18l-6 2.25z M9 7v13 M15 4.75v13";

                    return (
                        <button
                            key={link.id}
                            onClick={() => onNavigate(link.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors flex-1 ${isActive ? 'text-vp-cyan' : 'text-vp-muted hover:text-white'}`}
                        >
                            <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-vp-cyan/10' : ''}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={path} />
                                </svg>
                            </div>
                            <span className={`text-[10px] font-bold ${isActive ? 'text-vp-cyan' : 'opacity-80'}`}>{link.label}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}

