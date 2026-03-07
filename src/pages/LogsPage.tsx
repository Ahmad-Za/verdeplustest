import { useI18n } from '../i18n';
import type { UserRole } from '../data';

interface LogsProps {
    role?: UserRole;
}

export default function LogsPage({ role }: LogsProps) {
    const { t } = useI18n();

    // Mock data for infographics
    const monthlyData = [
        { month: 'Oct', value: 45 },
        { month: 'Nov', value: 52 },
        { month: 'Dec', value: 38 },
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 48 },
        { month: 'Mar', value: 55 },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto pb-24 relative animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">{t('logs.title')}</h2>
            <p className="text-vp-muted mb-8">{t('logs.desc')}</p>

            {/* Locked Overlay */}
            <div className="absolute inset-x-0 top-24 bottom-0 z-30 flex flex-col items-center justify-center bg-vp-bg/60 backdrop-blur-md rounded-2xl border border-white/10 mx-6">
                <div className="w-20 h-20 bg-vp-cyan/10 text-vp-cyan rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,128,0.2)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{t('logs.locked_title')}</h3>
                <p className="text-vp-muted max-w-md text-center mb-8 leading-relaxed">
                    {t('logs.locked_desc')}
                </p>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/20 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    {t('logs.coming_soon')}
                </div>
            </div>

            {/* Blurred Content */}
            <div className="opacity-40 pointer-events-none select-none filter blur-[2px]">
                {/* Infographics Chart Area */}
                <div className="glass-card p-8 mb-8">
                    <h3 className="text-lg font-bold mb-6">{t('logs.chart_title')}</h3>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full relative bg-white/5 rounded-t-lg transition-all group-hover:bg-white/10 h-full flex items-end justify-center">
                                    <div
                                        className="w-full md:w-3/4 bg-gradient-to-t from-vp-cyan/80 to-teal-400/80 rounded-t-lg transition-all duration-1000 md:group-hover:w-full group-hover:from-vp-cyan group-hover:to-teal-300 relative"
                                        style={{ height: `${(d.value / 100) * 100}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 flex items-center gap-1 rounded text-xs font-bold w-max pointer-events-none z-10 border border-white/10 shadow-lg">
                                            <span className="w-1.5 h-1.5 rounded-full bg-vp-cyan"></span>
                                            {d.value} AQI
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logs List Area */}
                <div className="glass-card mb-8">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-lg font-bold">{t('logs.history')}</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-vp-cyan/10 flex items-center justify-center text-vp-cyan transition-transform group-hover:scale-110 group-hover:bg-vp-cyan/20">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white group-hover:text-vp-cyan transition-colors">{t('logs.report')} #{2030 - i}</p>
                                        <p className="text-xs text-vp-muted mt-1">7 مارس 2026 - 12:0{i} PM</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-sm text-vp-muted w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                                    <span className="px-3 py-1 rounded-full bg-black/30 border border-white/5 whitespace-nowrap">AQI: {40 + i * 2}</span>
                                    <span className="px-3 py-1 rounded-full bg-black/30 border border-white/5 whitespace-nowrap">CH4: {2.1 + i * 0.1} ppm</span>
                                    <span className="px-3 py-1 rounded-full bg-black/30 border border-white/5 whitespace-nowrap">C3H8: {1.4 + i * 0.1} ppm</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {role === 'admin' || role === 'researcher' ? (
                        <div className="p-4 text-center border-t border-white/5 bg-vp-cyan/5 text-sm font-semibold text-vp-cyan">
                            تحميل المزيد من السجلات (CSV)
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

