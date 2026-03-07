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
                <div className="mt-4 glass-card p-5 border-vp-cyan/20">
                    <p className="text-xs text-vp-cyan font-semibold mb-1">{t('login.promo1')}</p>
                    <p className="text-sm text-vp-muted leading-relaxed">
                        {t('login.promo2')}
                    </p>
                </div>
            </div>
        </div>
    );
}

