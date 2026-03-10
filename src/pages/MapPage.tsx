import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { REGIONS, getStatus, MOCK_READINGS } from '../data';
import { useI18n } from '../i18n';

const getRegionPosition = (id: number) => {
    // Generate scattered coordinates between 10% and 85%
    const seed = id * 12345.6789;
    const x = 10 + ((seed % 100) / 100) * 75;
    const y = 10 + (((seed * 7) % 100) / 100) * 75;
    return { top: `${y}%`, left: `${x}%` };
};

export default function MapPage() {
    const { lang } = useI18n();
    const [readings, setReadings] = useState(MOCK_READINGS);

    useEffect(() => {
        // Fetch initial data
        const fetchReadings = async () => {
            const { data, error } = await supabase.from('readings').select('*');
            if (data && !error && data.length > 0) {
                const newReadings = REGIONS.map((region, id) => {
                    const row = data.find(d => d.region === region);
                    return {
                        id: id + 1,
                        date: new Date().toISOString().split('T')[0],
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
                const updatedRow = payload.new as any;
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

    return (
        <div className="p-3 md:p-6 max-w-7xl mx-auto animate-fade-in w-full max-w-[100vw] overflow-hidden">
            <h2 className="text-2xl font-bold mb-6">خارطة الأجهزة</h2>
            <div className="glass-card mb-8 p-4 md:p-6 transition-transform hover:-translate-y-1 duration-300 w-full overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                    <h3 className="text-lg font-bold">الخريطة التفاعلية للحرم الجامعي</h3>
                </div>
                <div className="overflow-x-auto pb-4 w-full block max-w-full">
                    {/* Replaced preserveAspectRatio="none" with "xMidYMid meet" to avoid stretching */}
                    <div className="relative min-w-[800px] max-w-[1200px] w-full aspect-[5/3] mx-auto bg-[#090F21] rounded-xl border border-white/5 overflow-hidden inset-shadow group/map">
                        <svg className="absolute inset-0 w-full h-full opacity-30 transition-opacity duration-500 group-hover/map:opacity-50" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
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
                            <path d="M 250 150 L 350 140 L 360 220 L 260 230 Z" fillOpacity="0.15" strokeOpacity="0.6" />
                            <rect x="270" y="160" width="80" height="60" fill="none" strokeOpacity="0.8" />
                            <polygon points="450,110 580,100 600,200 520,220 440,180" fillOpacity="0.1" strokeOpacity="0.7" />
                            <rect x="470" y="130" width="100" height="40" transform="rotate(-5 470 130)" fill="none" strokeOpacity="0.9" />
                            <path d="M 650 180 L 800 200 L 780 320 L 630 300 Z" fillOpacity="0.12" strokeOpacity="0.6" />
                            <circle cx="700" cy="420" r="60" fillOpacity="0.08" strokeOpacity="0.6" />
                            <circle cx="700" cy="420" r="40" fill="none" strokeOpacity="0.4" />
                            <circle cx="700" cy="420" r="20" fill="none" strokeOpacity="0.2" />
                            <path d="M 200 350 L 320 370 L 300 480 L 180 460 Z" fillOpacity="0.1" strokeOpacity="0.5" />
                            <rect x="420" y="380" width="150" height="120" rx="8" fillOpacity="0.15" strokeOpacity="0.6" />
                            <rect x="440" y="400" width="110" height="80" rx="4" fill="none" strokeOpacity="0.5" />
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
            </div>
        </div>
    );
}
