import { useState } from 'react';
import { type UserRole, MOCK_USERS } from '../data';
import { useI18n } from '../i18n';

interface LoginProps {
    onLogin: (role: UserRole, name: string) => void;
}

export default function LoginPage({ onLogin }: LoginProps) {
    const { t } = useI18n();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email);
            if (user) {
                onLogin(user.role, user.name);
            } else {
                setError(t('login.error'));
            }
            setLoading(false);
        }, 800);
    };

    const fillHints = () => {
        setEmail('admin@verde.edu');
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-fade-in">
            {/* Background glow blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-vp-cyan/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <img src="/verdeplus cyan.png" alt="VerdePlus" className="h-16 object-contain" />
                    </div>
                    <p className="text-vp-muted text-sm mt-3">{t('login.title')}</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8">

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm text-vp-muted mb-2">{t('login.email_label')}</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={t('login.email_placeholder')}
                                className="data-input"
                            />
                        </div>

                        {error && (
                            <p className="text-vp-red text-sm bg-vp-red/10 border border-vp-red/20 rounded-lg px-3 py-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-vp-red"></span> {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="neon-btn w-full flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <><span className="inline-block w-4 h-4 border-2 border-vp-bg/30 border-t-vp-bg rounded-full animate-spin" /> {t('login.checking')}</>
                            ) : t('login.button')}
                        </button>
                    </form>

                    {/* Hint */}
                    <button
                        type="button"
                        onClick={fillHints}
                        className="mt-4 w-full text-xs text-vp-muted/60 hover:text-vp-muted transition-colors flex items-center justify-center gap-1"
                    >
                        {t('login.hint')}
                    </button>
                </div>

                {/* Premium promo card */}
                <div className="mt-6 glass-card p-6 border-vp-cyan/30 text-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-vp-cyan/10 flex items-center justify-center text-vp-cyan mb-3">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <p className="text-sm text-vp-cyan font-bold mb-2">{t('login.promo1')}</p>
                    <p className="text-xs text-vp-muted leading-relaxed mb-4 max-w-xs">
                        {t('login.promo2')}
                    </p>
                    <a href="mailto:subscribe@verde.edu" className="secondary-btn w-full text-sm py-2 flex items-center justify-center gap-2">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        الاشتراك للباحثين
                    </a>
                </div>
            </div>
        </div>
    );
}

