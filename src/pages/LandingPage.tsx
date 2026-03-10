import { useI18n } from '../i18n';

interface LandingProps {
    onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingProps) {
    const { t } = useI18n();
    return (
        <div className="min-h-screen pt-20 pb-10 relative bg-transparent overflow-hidden animate-fade-in">
            {/* Glowing Orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-vp-cyan/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mt-16 mb-24 animate-fade-in relative">

                    {/* Hero Text */}
                    <div className="flex-1 text-center lg:text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-vp-cyan/30 bg-vp-cyan/5 text-vp-cyan text-xs font-bold mb-6">
                            <span className="w-2 h-2 rounded-full bg-vp-cyan animate-ping"></span>
                            <span className="w-2 h-2 rounded-full bg-vp-cyan absolute"></span>
                            النظام محدث
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-tr from-white via-white to-vp-muted leading-normal md:leading-snug">
                            {t('landing.title1')} <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-vp-cyan to-teal-400">{t('landing.title2')}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-vp-muted/90 mb-10 max-w-xl leading-relaxed">
                            {t('landing.desc')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => onNavigate('insights')}
                                className="bg-vp-cyan text-vp-bg px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,128,0.4)] flex items-center justify-center gap-2 group"
                            >
                                {t('landing.btn_insights')}
                                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <button
                                onClick={() => onNavigate('login')}
                                className="glass-card px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:bg-white/5 border-white/10 hover:border-vp-cyan/50 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                            >
                                {t('landing.btn_login')}
                            </button>
                        </div>
                    </div>

                    {/* Hero Visual Details - Floating Cards */}
                    <div className="flex-1 relative w-full h-[300px] md:h-[400px] mt-10 md:mt-0">
                        <img src="/verdeplus cyan.png" alt="VerdePlus Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] lg:w-[480px] object-contain drop-shadow-2xl z-20 opacity-90" />

                        {/* Floating Card 1 */}
                        <div className="absolute top-5 md:top-10 right-0 md:right-10 glass-card p-3 md:p-4 rounded-xl border-vp-cyan/30 shadow-glow-green animate-[fade-in_1s_ease-out_0.2s_both] hover:scale-105 transition-transform cursor-default z-30 backdrop-blur-md bg-vp-bg/60 transform scale-90 md:scale-100 origin-top-right">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-vp-cyan/20 flex items-center justify-center">
                                    <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-vp-cyan"></span>
                                </div>
                                <div>
                                    <p className="text-[9px] md:text-[10px] text-vp-muted uppercase tracking-wider">CH4 Levels</p>
                                    <p className="font-bold font-mono text-white text-xs md:text-sm">2.1 ppm</p>
                                </div>
                            </div>
                            <div className="w-full bg-white/10 h-1 md:h-1.5 rounded-full overflow-hidden">
                                <div className="bg-vp-cyan h-full w-[45%]"></div>
                            </div>
                        </div>

                        {/* Floating Card 2 */}
                        <div className="absolute bottom-5 md:bottom-10 left-0 md:left-5 glass-card p-3 md:p-4 rounded-xl border-vp-amber/30 shadow-glow-amber animate-[fade-in_1s_ease-out_0.5s_both] hover:scale-105 transition-transform cursor-default z-30 backdrop-blur-md bg-vp-bg/60 transform scale-90 md:scale-100 origin-bottom-left">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div>
                                    <p className="text-[9px] md:text-[10px] text-vp-muted uppercase tracking-wider mb-1">AQI Status</p>
                                    <p className="font-bold text-white text-base md:text-lg">Warning</p>
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-vp-amber leading-none">68</div>
                            </div>
                        </div>

                        {/* Floating Card 3 */}
                        <div className="absolute top-1/2 -right-2 md:-right-5 glass-card p-2 md:p-3 rounded-lg border-blue-500/30 animate-[fade-in_1s_ease-out_0.8s_both] hover:scale-105 transition-transform cursor-default z-10 backdrop-blur-md bg-vp-bg/40">
                            <p className="text-[9px] md:text-[10px] text-vp-muted flex items-center gap-1"><span className="text-blue-400">●</span> 10 Active Zones</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 border-y border-white/5 py-8 animate-[fade-in_1s_ease-out_1s_both]">
                    {[
                        { label: 'مناطق الحرم', val: '10' },
                        { label: 'أجهزة استشعار', val: '10+' },
                        { label: 'أنواع الغازات', val: '3' },
                        { label: 'دقة القراءة', val: '99.9%' },
                    ].map((s, i) => (
                        <div key={i} className="text-center border-l border-white/5 last:border-0 pl-4 border-l-white/10">
                            <p className="text-3xl font-extrabold text-white mb-1">{s.val}</p>
                            <p className="text-sm text-vp-muted">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Bento Features Grid */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">{t('landing.why')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Big Feature */}
                        <div className="md:col-span-2 glass-card p-8 transition-all hover:-translate-y-1 hover:shadow-glow-green group relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/5 rounded-full blur-3xl group-hover:bg-vp-cyan/10 transition-colors"></div>
                            <div className="w-14 h-14 bg-vp-cyan/10 text-vp-cyan rounded-2xl flex items-center justify-center mb-6 border border-vp-cyan/20 text-vp-cyan">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">تحليل فوري دقيق</h3>
                            <p className="text-vp-muted leading-relaxed max-w-lg relative z-10">مراقبة حية وتحديث مباشر لمستويات الميثان، البروبان، والهيدروجين عبر شبكة من أجهزة الاستشعار (IoT) الموزعة بذكاء في الحرم الجامعي، مع تنبيهات فورية لتجاوز العقبات.</p>
                        </div>

                        {/* Smaller Feature 1 */}
                        <div className="glass-card p-8 transition-all hover:-translate-y-1 hover:border-blue-500/30 group">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">رؤى بيانات متكاملة</h3>
                            <p className="text-sm text-vp-muted leading-relaxed">تحليلات بيانية وتاريخية تحدد المناطق الأكثر تلوثاً لاتخاذ قرارات أسرع.</p>
                        </div>

                        {/* Smaller Feature 2 */}
                        <div className="glass-card p-8 transition-all hover:-translate-y-1 hover:border-teal-500/30 group">
                            <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">أهداف مستدامة</h3>
                            <p className="text-sm text-vp-muted leading-relaxed">دعم تحقيق الحياد الكربوني ووضع الحلول الجذرية للمشاكل البيئية.</p>
                        </div>


                    </div>
                </div>

                {/* CTA Section */}
                <div className="glass-card p-12 text-center relative overflow-hidden rounded-3xl border-vp-cyan/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-vp-cyan/10 via-transparent to-blue-500/10"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-vp-cyan/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">التكنولوجيا من أجل بيئة مستدامة</h2>
                        <p className="text-vp-muted max-w-xl mx-auto mb-8 text-lg">
                            نجمع بين أحدث التقنيات والبيانات الحية لبناء مستقبل بيئي ذكي، أنظف وأكثر استدامة.
                        </p>
                        <a
                            href="https://www.instagram.com/py.plus.plus/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neon-btn px-8 py-4 text-lg rounded-xl inline-block"
                        >
                            انضم الآن
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

