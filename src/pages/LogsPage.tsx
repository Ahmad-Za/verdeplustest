import { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import type { UserRole } from '../data';
import { supabase } from '../supabase';
import { getStatus, REGIONS } from '../data';

interface LogsProps {
    role?: UserRole;
}

export default function LogsPage({ role }: LogsProps) {
    const { t, lang } = useI18n();
    const [currentDateIndex, setCurrentDateIndex] = useState(0);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Unused variables removed

    useEffect(() => {
        if (role !== 'admin' && role !== 'researcher') {
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('history_logs')
                .select('*')
                .order('date', { ascending: false });

            if (data && !error && data.length > 0) {
                const dates = Array.from(new Set(data.map((d: any) => d.date)));
                setAvailableDates(dates);
                setLogs(data);
            } else {
                setAvailableDates([]);
                setLogs([]);
            }
            setLoading(false);
        };
        fetchLogs();
    }, [role]);

    const handlePrev = () => {
        if (currentDateIndex < availableDates.length - 1) {
            setCurrentDateIndex(prev => prev + 1); // Older date
        }
    };

    const handleNext = () => {
        if (currentDateIndex > 0) {
            setCurrentDateIndex(prev => prev - 1); // Newer date
        }
    };

    const currentRecords = logs.filter(l => l.date === availableDates[currentDateIndex]);

    const handleExportCSV = () => {
        if (!currentRecords.length) return;

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Arabic support
        csvContent += "Region,CH4,C3H8,H2\n";

        currentRecords.forEach(r => {
            csvContent += `${r.region},${r.ch4},${r.c3h8},${r.h2}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `VerdePlus_Report_${availableDates[currentDateIndex]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-3 md:p-6 max-w-7xl mx-auto pb-24 relative animate-fade-in w-full max-w-[100vw] overflow-hidden">
            <h2 className="text-2xl font-bold mb-2">{t('logs.title')}</h2>
            <p className="text-vp-muted mb-8">{t('logs.desc')}</p>

            {/* Locked Overlay for regular users/guests */}
            {role !== 'admin' && role !== 'researcher' && (
                <div className="absolute inset-x-0 top-24 bottom-0 z-30 flex flex-col items-center justify-center bg-vp-bg/60 backdrop-blur-md rounded-2xl border border-white/10 mx-6">
                    <div className="w-20 h-20 bg-vp-cyan/10 text-vp-cyan rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(110,204,219,0.2)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{t('logs.locked_title')}</h3>
                    <p className="text-vp-muted max-w-md text-center mb-8 leading-relaxed">
                        {t('logs.locked_desc')}
                    </p>
                    <a href="mailto:info@verde.edu" className="flex items-center gap-2 bg-vp-cyan/10 text-vp-cyan hover:bg-vp-cyan/20 px-4 py-2 rounded-lg border border-vp-cyan/20 text-sm font-semibold transition-colors">
                        <span className="w-2 h-2 rounded-full bg-vp-cyan animate-pulse"></span>
                        {t('logs.coming_soon')}
                    </a>
                </div>
            )}

            {/* Blurred Content or Clear Content based on access */}
            <div className={role !== 'admin' && role !== 'researcher' ? "opacity-40 pointer-events-none select-none filter blur-[4px]" : ""}>

                {/* Historical Tables with Pagination */}
                <div className="glass-card p-4 md:p-6 mb-8 mt-2 overflow-hidden w-full">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 flex-wrap gap-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span>
                            الجداول اليومية التاريخية
                        </h3>
                        <div className="flex items-center gap-4 bg-black/30 rounded-lg p-1 border border-white/5 w-full sm:w-auto justify-between sm:justify-start">
                            <button
                                onClick={lang === 'ar' ? handleNext : handlePrev}
                                disabled={lang === 'ar' ? currentDateIndex === 0 : currentDateIndex === availableDates.length - 1}
                                className="p-2 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <span className="font-mono text-vp-cyan font-bold min-w-[100px] text-center text-sm md:text-base">
                                {availableDates[currentDateIndex] || 'لا توجد بيانات'}
                            </span>
                            <button
                                onClick={lang === 'ar' ? handlePrev : handleNext}
                                disabled={lang === 'ar' ? currentDateIndex === availableDates.length - 1 : currentDateIndex === 0}
                                className="p-2 hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-vp-cyan animate-pulse">جارٍ جلب السجلات...</div>
                    ) : (
                        <div className="flex flex-col gap-4 mt-4 w-full max-w-full">
                            <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/20 w-full pb-2 block max-w-full">
                                <table className="w-full text-xs md:text-sm whitespace-nowrap min-w-[500px]">
                                    <thead className={`bg-black/30 ${lang === 'en' ? 'text-left' : 'text-right'}`}>
                                        <tr className="text-vp-muted border-b border-white/10">
                                            <th className="py-4 px-3 font-medium">{t('insights.region')}</th>
                                            <th className="py-4 px-3 font-medium">CH₄ <span className="text-[10px] text-vp-muted">(ppm)</span></th>
                                            <th className="py-4 px-3 font-medium">C₃H₈ <span className="text-[10px] text-vp-muted">(ppm)</span></th>
                                            <th className="py-4 px-3 font-medium">H₂ <span className="text-[10px] text-vp-muted">(ppm)</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {REGIONS.map((region, i) => {
                                            const r = currentRecords.find(x => x.region === region) || { ch4: 0, c3h8: 0, h2: 0, region };
                                            const ch4S = getStatus('ch4', r.ch4);
                                            const c3h8S = getStatus('c3h8', r.c3h8);
                                            const h2S = getStatus('h2', r.h2);

                                            return (
                                                <tr key={i} className={`transition-colors border-l-4 border-transparent hover:bg-white/[0.04]`}>
                                                    <td className="py-4 px-3 font-bold bg-black/10 border-r border-white/5 truncate max-w-[120px] md:max-w-none" title={r.region}>{r.region}</td>
                                                    <td className={`py-4 px-3 text-center font-mono ${ch4S === 'danger' ? 'text-vp-red font-bold' : ch4S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{typeof r.ch4 === 'number' ? r.ch4.toFixed(1) : parseFloat(r.ch4).toFixed(1)}</td>
                                                    <td className={`py-4 px-3 text-center font-mono ${c3h8S === 'danger' ? 'text-vp-red font-bold' : c3h8S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{typeof r.c3h8 === 'number' ? r.c3h8.toFixed(1) : parseFloat(r.c3h8).toFixed(1)}</td>
                                                    <td className={`py-4 px-3 text-center font-mono ${h2S === 'danger' ? 'text-vp-red font-bold' : h2S === 'warning' ? 'text-vp-amber font-bold' : 'text-vp-cyan'}`}>{typeof r.h2 === 'number' ? r.h2.toFixed(1) : parseFloat(r.h2).toFixed(1)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {role === 'admin' || role === 'researcher' ? (
                                <div className="flex flex-col gap-2 w-full">
                                    <button onClick={handleExportCSV} className="w-full p-4 rounded-xl border border-white/5 bg-vp-cyan/10 hover:bg-vp-cyan/20 transition-colors text-sm font-semibold text-vp-cyan flex items-center justify-center gap-2">
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        تصدير تقرير اليوم (CSV)
                                    </button>
                                    <button onClick={() => {
                                        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
                                        csvContent += "Region,CH4,C3H8,H2\n";
                                        const encodedUri = encodeURI(csvContent);
                                        const link = document.createElement("a");
                                        link.setAttribute("href", encodedUri);
                                        link.setAttribute("download", `VerdePlus_Monthly_Report.csv`);
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }} className="w-full p-4 rounded-xl border border-white/5 bg-blue-500/10 hover:bg-blue-500/20 transition-colors text-sm font-semibold text-blue-400 flex items-center justify-center gap-2">
                                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        تصدير التقرير الشهري (CSV)
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Infographics Chart Area: Regions Comparison */}
                <div className="glass-card p-4 md:p-8 mb-8 overflow-hidden">
                    <h3 className="text-base md:text-lg font-bold mb-6">مقارنة التلوث بين المناطق (CH₄) - {availableDates[currentDateIndex] || 'اليوم'}</h3>
                    <div className="overflow-x-auto pb-4">
                        <div className="h-64 flex items-end justify-between gap-1 md:gap-2 min-w-[500px] md:min-w-[700px] px-2">
                        {REGIONS.map((region, i) => {
                            const r = currentRecords.find(x => x.region === region) || { ch4: 0, c3h8: 0, h2: 0 };
                            // Calculate a fake "percentage" based on danger threshold for CH4 (7.0 for danger)
                            const val = typeof r.ch4 === 'number' ? r.ch4 : parseFloat(r.ch4) || 0;
                            const heightPercent = Math.min((val / 7.0) * 100, 100);
                            const status = getStatus('ch4', val);
                            const colorClass = status === 'danger' ? 'from-vp-red to-red-400 group-hover:from-vp-red group-hover:to-red-300'
                                : status === 'warning' ? 'from-vp-amber to-amber-400 group-hover:from-vp-amber group-hover:to-amber-300'
                                    : 'from-vp-cyan/80 to-teal-400/80 group-hover:from-vp-cyan group-hover:to-teal-300';

                            // Shorten region name for chart
                            const shortRegion = region.replace("كلية الهندسة", "هـ.").replace("المسكن الجامعي", "سكن");

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
                                    <div className="w-full relative bg-white/5 rounded-t-lg transition-all group-hover:bg-white/10 h-full flex items-end justify-center">
                                        <div
                                            className={`w-full md:w-3/4 bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-1000 md:group-hover:w-full relative`}
                                            style={{ height: `${Math.max(heightPercent, 2)}%` }} // At least 2% height so it's visible
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 flex items-center gap-1 rounded text-xs font-bold w-max pointer-events-none z-10 border border-white/10 shadow-lg">
                                                <span className={`w-1.5 h-1.5 rounded-full ${status === 'danger' ? 'bg-vp-red' : status === 'warning' ? 'bg-vp-amber' : 'bg-vp-cyan'}`}></span>
                                                {val.toFixed(1)} CH₄
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-center h-8 leading-tight flex items-end justify-center">{shortRegion}</span>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

