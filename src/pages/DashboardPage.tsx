import { useState, useMemo, useEffect } from 'react';
import { type UserRole, MOCK_READINGS, SESSION_CARDS, getStatus, overallAQI, REGIONS } from '../data';
import { Sparkline } from '../components/Sparkline';
import { useI18n } from '../i18n';
import { supabase } from '../supabase';

const getRegionPosition = (id: number) => {
    // Generate scattered coordinates between 10% and 85%
    const seed = id * 12345.6789;
    const x = 10 + ((seed % 100) / 100) * 75;
    const y = 10 + (((seed * 7) % 100) / 100) * 75;
    return { top: `${y}%`, left: `${x}%` };
};

interface DashboardProps {
    role?: UserRole;
    onNavigate: (page: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardProps) {
    const { t, lang } = useI18n();
    const [readings, setReadings] = useState(MOCK_READINGS);

    useEffect(() => {
        // Fetch initial data
        const fetchReadings = async () => {
            const { data, error } = await supabase.from('readings').select('*');
            if (data && !error && data.length > 0) {
                // Map DB rows back to frontend format
                const newReadings = REGIONS.map((region, id) => {
                    const row = data.find(d => d.region === region);
                    return {
                        id: id + 1,
                        date: new Date().toISOString().split('T')[0], // Add missing date back for frontend typings
                        region,
                        ch4: row ? parseFloat(row.ch4) : 0,
                        c3h8: row ? parseFloat(row.c3h8) : 0,
                        h2: row ? parseFloat(row.h2) : 0
                    };
                });
                setReadings(newReadings);
            }
        };

        fetchReadings();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public:readings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'readings' }, (payload) => {
                const updatedRow = payload.new as { region: string; ch4: string | number; c3h8: string | number; h2: string | number };
                setReadings(prev => prev.map(r =>
                    r.region === updatedRow.region ? {
                        ...r,
                        ch4: Number(updatedRow.ch4),
                        c3h8: Number(updatedRow.c3h8),
                        h2: Number(updatedRow.h2),
                    } : r
                ));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const aqi = overallAQI(readings);
    const aqiStatus = aqi < 40 ? 'normal' : aqi < 70 ? 'warning' : 'danger';
    const aqiColor = aqiStatus === 'normal' ? '#6ECCDB' : aqiStatus === 'warning' ? '#FFB84C' : '#FF4C4C';
    const aqiLabel = aqiStatus === 'normal' ? t('insights.normal') : aqiStatus === 'warning' ? t('insights.warning') : t('insights.danger');
    const aqiTip = aqiStatus === 'normal' ? t('health.good') : aqiStatus === 'warning' ? t('health.moderate') : t('health.hazardous');

    const topZones = useMemo(() =>
        [...readings]
            .sort((a, b) => (b.ch4 + b.c3h8 + b.h2) - (a.ch4 + a.c3h8 + a.h2))
            .slice(0, 3),
        [readings]
    );

    const avgGas = useMemo(() => {
        const len = readings.length || 1;
        return {
            ch4: readings.reduce((acc, curr) => acc + curr.ch4, 0) / len,
            c3h8: readings.reduce((acc, curr) => acc + curr.c3h8, 0) / len,
            h2: readings.reduce((acc, curr) => acc + curr.h2, 0) / len
        };
    }, [readings]);

    const gasCards = [
        { key: 'ch4', label: 'ميثان (CH₄)', unit: 'ppm', val: avgGas.ch4, tooltip: t('tooltip.ch4') },
        { key: 'c3h8', label: 'بروبان (C₃H₈)', unit: 'ppm', val: avgGas.c3h8, tooltip: t('tooltip.c3h8') },
        { key: 'h2', label: 'هيدروجين (H₂)', unit: 'ppm', val: avgGas.h2, tooltip: t('tooltip.h2') },
    ];

    const [activeTag, setActiveTag] = useState<string | null>(null);
    const tags = ['كل الجلسات', 'طاقة متجددة', 'هندسة عمارة', 'انبعاثات'];
    const filteredSessions = activeTag && activeTag !== 'كل الجلسات'
        ? SESSION_CARDS.filter(s => s.tag === activeTag)
        : SESSION_CARDS;

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">{t('insights.title')}</h2>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                {/* Hero AQI Card */}
                <div
                    className={`md:col-span-2 glass-card p-8 flex flex-col justify-between min-h-[200px] transition-all duration-500 hover:scale-[1.01] ${aqiStatus === 'warning' ? 'shadow-[0_0_30px_rgba(255,184,76,0.1)] border-yellow-500/20' :
                        aqiStatus === 'danger' ? 'shadow-[0_0_40px_rgba(255,76,76,0.2)] border-red-500/30' : ''
                        }`}
                >
                    <div>
                        <p className="text-vp-muted text-sm mb-1">{t('insights.aqi')}</p>
                        <p className="text-xs text-vp-muted">{t('insights.campus')}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vp-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-vp-cyan"></span>
                        </span>
                        <span className="text-xs text-vp-cyan font-medium">{t('insights.live')}</span>
                    </div>
                    <div className="flex items-end gap-6 mt-6">
                        <div>
                            <p className="font-extrabold leading-none mb-2" style={{ fontSize: '6rem', color: aqiColor, textShadow: `0 0 30px ${aqiColor}55` }}>
                                {aqi}
                            </p>
                            <span className={`status-badge-${aqiStatus}`}>{aqiLabel}</span>
                        </div>
                        <div className="pb-1">
                            <p className="text-vp-muted text-sm pb-3 leading-relaxed">
                                متوسط مؤشر تلوث الغازات الثلاثة<br />عبر 10 مناطق في الحرم الجامعي
                            </p>
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-2">
                                <span className="text-sm font-medium text-white/90">{aqiTip}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Zones */}
                <div className="glass-card p-6 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
                        <p className="text-sm font-semibold text-vp-muted">{t('insights.worst')}</p>
                    </div>
                    <div className="space-y-3">
                        {topZones.map((z, i) => {
                            const total = z.ch4 + z.c3h8 + z.h2;
                            const s = getStatus('ch4', z.ch4);
                            return (
                                <div key={z.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-vp-muted font-mono text-xs">#{i + 1}</span>
                                        <span className="text-sm font-medium">{z.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{total.toFixed(1)}</span>
                                        <span className={`status-badge-${s === 'danger' ? 'danger' : s === 'warning' ? 'warning' : 'normal'}`}>
                                            {s === 'normal' ? '↓' : s === 'warning' ? '↑' : '⚠'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gas Micro-cards */}
                {gasCards.map(g => {
                    const s = getStatus(g.key, g.val);
                    const cardColor = s === 'normal' ? '#6ECCDB' : s === 'warning' ? '#FFB84C' : '#FF4C4C';
                    return (
                        <div key={g.key} className={`glass-card p-5 transition-all duration-300 group ${s !== 'normal' ? 'border-t-2 hover:-translate-y-1' : 'hover:-translate-y-1'}`} style={{ borderTopColor: s !== 'normal' ? cardColor : 'transparent', boxShadow: s === 'danger' ? '0 10px 30px -10px rgba(255,76,76,0.1)' : '' }}>
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-1.5 group/tooltip relative w-fit mt-1 mb-1">
                                        <p className="text-vp-muted text-xs transition-colors group-hover:text-white cursor-help border-b border-dashed border-white/20 pb-0.5">{g.label}</p>
                                        {/* Tooltip Hover */}
                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black text-xs text-white rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-20 border border-white/10 shadow-xl">
                                            {g.tooltip}
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold mt-1" style={{ color: cardColor }}>
                                        {g.val.toFixed(1)}
                                        <span className="text-sm text-vp-muted font-normal mr-1">{g.unit}</span>
                                    </p>
                                </div>
                                <span className={`status-badge-${s === 'danger' ? 'danger' : s === 'warning' ? 'warning' : 'normal'}`}>
                                    {s === 'normal' ? t('level.good') : s === 'warning' ? t('level.moderate') : t('level.danger')}
                                </span>
                            </div>
                            <Sparkline gas={g.key as 'ch4' | 'c3h8' | 'h2'} color={cardColor} />
                        </div>
                    );
                })}

                {/* Gamification — Leaderboard */}
                <div className="glass-card p-6 transition-transform hover:-translate-y-1 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-1.5 h-4 bg-yellow-400 rounded-full"></span>
                        <p className="text-sm font-semibold">تحدي الأقسام</p>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'الهندسة المعلوماتية', pts: 920, medal: 'المركز الأول' },
                            { name: 'الهندسة المعمارية', pts: 880, medal: 'المركز الثاني' },
                            { name: 'الهندسة الكهربائية', pts: 840, medal: 'المركز الثالث' },
                        ].map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${i === 0 ? 'bg-yellow-500/20 text-yellow-500' : i === 1 ? 'bg-gray-400/20 text-gray-400' : 'bg-amber-700/20 text-amber-600'}`}>
                                        {i + 1}
                                    </span>
                                    <span className="text-sm">{d.name}</span>
                                </div>
                                <span className="text-vp-cyan font-mono text-sm">{d.pts} pts</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-vp-muted mt-4 border-t border-white/5 pt-4">
                        الكلية التي تسجل أقل قراءات تلوث تحصل على نقاط استدامة أعلى.
                    </p>
                </div>

            </div>

            {/* Interactive Campus Map (Lightweight) */}
            <div className="glass-card mb-8 p-6 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                    <h3 className="text-lg font-bold">الخريطة التفاعلية للحرم الجامعي</h3>
                </div>
                <div className="relative w-full h-[500px] bg-[#090F21] rounded-xl border border-white/5 overflow-hidden inset-shadow group/map">
                    {/* Detailed Blueprint Campus Map SVG */}
                    <svg className="absolute inset-0 w-full h-full opacity-30 mt-4 md:mt-0 transition-opacity duration-500 group-hover/map:opacity-50" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6ECCDB" strokeWidth="0.5" strokeOpacity="0.2" />
                            </pattern>
                        </defs>

                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Campus external bounds */}
                        <path d="M 80 80 L 850 120 L 920 520 L 150 480 Z" fill="#6ECCDB" opacity="0.05" stroke="#6ECCDB" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="10,5" />

                        {/* Main roads */}
                        <path d="M -50 250 Q 500 200 1050 300" fill="none" stroke="#6ECCDB" strokeWidth="30" strokeOpacity="0.1" />
                        <path d="M -50 250 Q 500 200 1050 300" fill="none" stroke="#6ECCDB" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="15,10" />
                        <path d="M 400 -50 Q 550 300 350 650" fill="none" stroke="#6ECCDB" strokeWidth="20" strokeOpacity="0.1" />
                        <path d="M 400 -50 Q 550 300 350 650" fill="none" stroke="#6ECCDB" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5,5" />

                        {/* Building Blocks */}
                        <g fill="#6ECCDB" stroke="#6ECCDB" strokeWidth="1.5">
                            {/* Main Library */}
                            <path d="M 250 150 L 350 140 L 360 220 L 260 230 Z" fillOpacity="0.15" strokeOpacity="0.6" />
                            <rect x="270" y="160" width="80" height="60" fill="none" strokeOpacity="0.8" />

                            {/* IT Faculty */}
                            <polygon points="450,110 580,100 600,200 520,220 440,180" fillOpacity="0.1" strokeOpacity="0.7" />
                            <rect x="470" y="130" width="100" height="40" transform="rotate(-5 470 130)" fill="none" strokeOpacity="0.9" />

                            {/* Engineering Faculty */}
                            <path d="M 650 180 L 800 200 L 780 320 L 630 300 Z" fillOpacity="0.12" strokeOpacity="0.6" />

                            {/* Circular / Dome structure */}
                            <circle cx="700" cy="420" r="60" fillOpacity="0.08" strokeOpacity="0.6" />
                            <circle cx="700" cy="420" r="40" fill="none" strokeOpacity="0.4" />
                            <circle cx="700" cy="420" r="20" fill="none" strokeOpacity="0.2" />

                            {/* Science lab block */}
                            <path d="M 200 350 L 320 370 L 300 480 L 180 460 Z" fillOpacity="0.1" strokeOpacity="0.5" />

                            {/* Administrative Building */}
                            <rect x="420" y="380" width="150" height="120" rx="8" fillOpacity="0.15" strokeOpacity="0.6" />
                            <rect x="440" y="400" width="110" height="80" rx="4" fill="none" strokeOpacity="0.5" />

                            {/* Smaller ancillary buildings */}
                            <rect x="120" y="280" width="50" height="40" fillOpacity="0.1" strokeOpacity="0.4" />
                            <rect x="850" y="360" width="40" height="70" fillOpacity="0.1" strokeOpacity="0.4" />
                            <rect x="580" y="250" width="30" height="30" fillOpacity="0.1" strokeOpacity="0.4" />
                        </g>

                        {/* Decoration Trees/Parks */}
                        <g fill="none" stroke="#6ECCDB" strokeWidth="1" strokeOpacity="0.3">
                            <circle cx="150" cy="200" r="15" />
                            <circle cx="170" cy="180" r="10" />
                            <circle cx="400" cy="140" r="12" />
                            <circle cx="600" cy="130" r="18" />
                            <circle cx="820" cy="450" r="20" />
                            <circle cx="800" cy="480" r="15" />
                            <circle cx="350" cy="450" r="18" />
                        </g>
                    </svg>

                    {readings.map(r => {
                        const s = getStatus('ch4', r.ch4);
                        const pos = getRegionPosition(r.id);
                        const bg = s === 'danger' ? 'bg-vp-red' : s === 'warning' ? 'bg-vp-amber' : 'bg-vp-cyan';
                        return (
                            <div key={r.id} className="absolute group z-10" style={pos}>
                                {/* Pulse animation */}
                                <span className={`absolute -inset-1 rounded-full animate-ping opacity-75 ${bg}`}></span>
                                {/* Dot */}
                                <div className={`relative w-4 h-4 border-2 border-[#0B132B] rounded-full cursor-pointer shadow-lg ${bg}`}></div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 min-w-[12rem] px-3 py-2 bg-[#111A33]/95 border border-white/10 rounded-lg text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 shadow-xl backdrop-blur-sm"
                                    style={lang === 'ar' ? { right: '50%', transform: 'translateX(50%)' } : { left: '50%', transform: 'translateX(-50%)' }}>
                                    <p className="font-bold text-white mb-1 whitespace-nowrap">{r.region}</p>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-vp-muted">AQI</span>
                                        <span className={`font-mono font-bold ${s === 'danger' ? 'text-vp-red' : s === 'warning' ? 'text-vp-amber' : 'text-vp-cyan'}`}>{(r.ch4 + r.c3h8 + r.h2).toFixed(1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-vp-muted">CH₄</span>
                                        <span className="font-mono text-white">{r.ch4} <span className="text-[10px] text-vp-muted">ppm</span></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Historical Dashboard navigation */}
            <div
                onClick={() => onNavigate('logs')}
                className="glass-card mb-8 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 hover:border-vp-cyan/30 transition-all cursor-pointer group relative overflow-hidden"
            >
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-vp-cyan/10 rounded-full blur-2xl group-hover:bg-vp-cyan/20 transition-colors"></div>
                <div className="flex items-center gap-5 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-vp-cyan/20 to-teal-500/20 text-vp-cyan rounded-2xl flex items-center justify-center backdrop-blur-md border border-vp-cyan/30 group-hover:scale-110 transition-transform">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-1 text-white group-hover:text-vp-cyan transition-colors">{t('insights.logs_title')}</h3>
                        <p className="text-sm text-vp-muted">{t('insights.logs_desc')}</p>
                    </div>
                </div>
                <button className="neon-btn px-6 py-2.5 whitespace-nowrap hidden md:block z-10">{t('insights.logs_btn')}</button>
            </div>

            {/* Historical Data Table */}
            <div className="glass-card p-6 mb-8 transition-transform hover:scale-[1.01] duration-300">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
                    <p className="text-lg font-semibold">{t('insights.table_title')}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className={lang === 'en' ? 'text-left' : 'text-right'}>
                            <tr className="text-vp-muted border-b border-white/5">
                                <th className="pb-3 font-medium">{t('insights.region')}</th>
                                <th className="pb-3 font-medium">CH₄ (ppm)</th>
                                <th className="pb-3 font-medium">C₃H₈ (ppm)</th>
                                <th className="pb-3 font-medium">H₂ (ppm)</th>
                                <th className="pb-3 font-medium">{t('insights.status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {readings.map(r => {
                                const overallS = getStatus('ch4', r.ch4); // mainly just for the final status badge / row border
                                const ch4S = getStatus('ch4', r.ch4);
                                const c3h8S = getStatus('c3h8', r.c3h8);
                                const h2S = getStatus('h2', r.h2);

                                return (
                                    <tr key={r.id} className={`transition-colors border-l-4 hover:bg-white/[0.04] ${overallS === 'danger' ? 'border-vp-red bg-vp-red/5' : overallS === 'warning' ? 'border-vp-amber bg-vp-amber/5' : 'border-transparent'}`}>
                                        <td className="py-3 px-2 font-medium">{r.region}</td>
                                        <td className={`py-3 font-mono ${ch4S === 'danger' ? 'text-vp-red font-bold' : ch4S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{r.ch4.toFixed(1)}</td>
                                        <td className={`py-3 font-mono ${c3h8S === 'danger' ? 'text-vp-red font-bold' : c3h8S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{r.c3h8.toFixed(1)}</td>
                                        <td className={`py-3 font-mono ${h2S === 'danger' ? 'text-vp-red font-bold' : h2S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{r.h2.toFixed(1)}</td>
                                        <td className="py-3">
                                            <span className={`status-badge-${overallS === 'danger' ? 'danger' : overallS === 'warning' ? 'warning' : 'normal'}`}>
                                                {overallS === 'normal' ? t('level.good') : overallS === 'warning' ? t('level.moderate') : t('level.danger')}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Session Cards */}
            <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                        <p className="text-lg font-semibold">{t('insights.sessions')}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {tags.map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTag(t === 'كل الجلسات' ? null : t)}
                                className={`tag-btn ${(activeTag === t || (t === 'كل الجلسات' && !activeTag)) ? 'active' : ''}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredSessions.map(s => (
                        <div key={s.id} className="glass-card p-5 flex flex-col gap-3 transition-transform hover:-translate-y-2 hover:shadow-glow-green duration-300">
                            <div className="flex items-center justify-between">
                                <span className="tag-btn active text-xs">{s.tag}</span>
                                <span className="text-vp-muted text-xs bg-white/5 px-2 py-1 rounded-md">{s.date}</span>
                            </div>
                            <h3 className="font-semibold text-sm leading-snug">{s.title}</h3>
                            <div className="space-y-1.5 mt-1">
                                {s.tldr.map((t, i) => (
                                    <p key={i} className="text-xs text-vp-muted flex gap-2 items-start">
                                        <span className="text-vp-cyan mt-0.5 inline-block w-1.5 h-1.5 rounded-full bg-vp-cyan shrink-0 relative top-1"></span>
                                        {t}
                                    </p>
                                ))}
                            </div>
                            <div className="mt-auto border-t border-white/5 pt-3 flex items-center gap-2 text-xs text-vp-muted/80">
                                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">م</span>
                                {s.dept}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

