import { useState, useRef, useEffect } from 'react';
import { REGIONS, GAS_THRESHOLDS } from '../data';
import { supabase } from '../supabase';

type Reading = { ch4: string; c3h8: string; h2: string };

const MOCK_YESTERDAY: Reading[] = [
    { ch4: '1.2', c3h8: '0.5', h2: '0.1' },
    { ch4: '1.5', c3h8: '0.8', h2: '0.2' },
    { ch4: '1.1', c3h8: '0.4', h2: '0.1' },
    { ch4: '1.3', c3h8: '0.6', h2: '0.1' },
    { ch4: '1.0', c3h8: '0.3', h2: '0.1' },
    { ch4: '0.9', c3h8: '0.3', h2: '0.1' },
    { ch4: '2.1', c3h8: '1.2', h2: '0.3' },
    { ch4: '2.5', c3h8: '1.5', h2: '0.4' },
    { ch4: '0.8', c3h8: '0.2', h2: '0.1' },
    { ch4: '0.9', c3h8: '0.3', h2: '0.1' },
];

const GAS_KEYS: (keyof Reading)[] = ['ch4', 'c3h8', 'h2'];
const GAS_LABELS: Record<keyof Reading, string> = { ch4: 'ميثان (CH₄)', c3h8: 'بروبان (C₃H₈)', h2: 'هيدروجين (H₂)' };

function emptyReadings(): Reading[] {
    return REGIONS.map(() => ({ ch4: '', c3h8: '', h2: '' }));
}

function inputClass(gas: keyof Reading, val: string) {
    const n = parseFloat(val);
    if (isNaN(n) || !val) return 'data-input';
    const t = GAS_THRESHOLDS[gas];
    if (n >= t.danger) return 'data-input error';
    if (n >= t.warn) return 'data-input warn';
    return 'data-input';
}

export default function AdminPage() {
    const [readings, setReadings] = useState<Reading[]>(emptyReadings);
    const [saved, setSaved] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const gridRef = useRef<HTMLTableElement>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleChange = (row: number, gas: keyof Reading, val: string) => {
        setReadings(prev => prev.map((r, i) => i === row ? { ...r, [gas]: val } : r));
    };

    const copyYesterday = () => {
        setReadings(MOCK_YESTERDAY.map(r => ({ ...r })));
    };

    useEffect(() => {
        // Fetch current values on mount so we don't overwrite everything with 0
        const fetchCurrent = async () => {
            const { data, error } = await supabase.from('readings').select('*');
            if (error) {
                console.error("Error fetching readings:", error);
                return;
            }
            if (data && data.length > 0) {
                const newReadings = [...emptyReadings()];
                data.forEach((d: { region: string; ch4: number | string; c3h8: number | string; h2: number | string; }) => {
                    const idx = REGIONS.indexOf(d.region);
                    if (idx !== -1) {
                        newReadings[idx] = {
                            ch4: d.ch4.toString(),
                            c3h8: d.c3h8.toString(),
                            h2: d.h2.toString()
                        };
                    }
                });
                setReadings(newReadings);
            }
        };
        fetchCurrent();
    }, []);

    const handleSave = async () => {
        const payload = readings.map((r, i) => ({
            region: REGIONS[i],
            ch4: parseFloat(r.ch4) || 0,
            c3h8: parseFloat(r.c3h8) || 0,
            h2: parseFloat(r.h2) || 0
        })).filter(r => r.ch4 !== 0 || r.c3h8 !== 0 || r.h2 !== 0); // Only save non-empty rows

        if (payload.length === 0) return;

        const { error } = await supabase
            .from('readings')
            .upsert(payload, { onConflict: 'region' });

        if (error) {
            console.error("Error saving data:", error);
            showToast("حدث خطأ أثناء الحفظ. يرجى المحاولة لاحقاً.", 'error');
            return;
        }

        // Also save a snapshot to historical logs
        const currentDate = new Date().toISOString().split('T')[0];
        const historyPayload = payload.map(r => ({
            ...r,
            date: currentDate
        }));

        await supabase.from('history_logs').insert(historyPayload);

        setSaved(true);
        showToast("نم حفظ البيانات بنجاح!", 'success');
        setTimeout(() => setSaved(false), 3000);
    };

    // Keyboard navigation: arrow keys + Enter
    const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
        let nextRow = row, nextCol = col;
        if (e.key === 'ArrowDown' || e.key === 'Enter') { nextRow = Math.min(row + 1, REGIONS.length - 1); }
        else if (e.key === 'ArrowUp') { nextRow = Math.max(row - 1, 0); }
        else if (e.key === 'Tab' && !e.shiftKey) { nextCol = (col + 1) % GAS_KEYS.length; if (nextCol === 0) nextRow = Math.min(row + 1, REGIONS.length - 1); }
        else if (e.key === 'Tab' && e.shiftKey) { /* default */ return; }
        else return;
        if (e.key !== 'Tab') e.preventDefault();

        const cell = gridRef.current?.querySelector<HTMLInputElement>(`[data-cell="${nextRow}-${nextCol}"]`);
        if (cell) { cell.focus(); cell.select(); }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-24 animate-fade-in">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold">إدخال البيانات اليدوي</h2>
                    <p className="text-vp-muted text-sm mt-1">
                        استخدم <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">الأسهم</kbd> أو <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-xs">Enter</kbd> للتنقل السريع بين الحقول.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={copyYesterday} className="secondary-btn text-sm py-2">
                        📋 نسخ قراءات الأمس
                    </button>
                    <button onClick={handleSave} className="neon-btn text-sm py-2 flex items-center gap-2">
                        {saved ? '✅ تم الحفظ!' : '💾 حفظ القراءات'}
                    </button>
                </div>
            </div>

            {saved && (
                <div className="mb-5 bg-vp-cyan/10 border border-vp-cyan/20 text-vp-cyan rounded-xl px-4 py-3 text-sm">
                    ✅ تم حفظ جميع القراءات بنجاح!
                </div>
            )}

            <div className="glass-card p-0 md:p-6 overflow-x-auto w-full">
                <table ref={gridRef} className="w-full text-sm min-w-[700px]">
                    <thead>
                        <tr className="text-vp-muted border-b border-white/5 text-right">
                            <th className="pb-3 font-medium pl-4">المنطقة</th>
                            {GAS_KEYS.map(g => (
                                <th key={g} className="pb-3 font-medium px-2">
                                    {GAS_LABELS[g]}
                                    <span className="text-vp-muted/50 text-xs font-normal ml-1">(ppm)</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {REGIONS.map((region, row) => (
                            <tr key={region} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 pl-4 font-medium text-sm whitespace-nowrap">{region}</td>
                                {GAS_KEYS.map((gas, col) => (
                                    <td key={gas} className="py-2 px-2">
                                        <input
                                            id={`cell-${row}-${col}`}
                                            data-cell={`${row}-${col}`}
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={readings[row][gas]}
                                            onChange={e => handleChange(row, gas, e.target.value)}
                                            onKeyDown={e => handleKeyDown(e, row, col)}
                                            onFocus={e => e.target.select()}
                                            className={inputClass(gas, readings[row][gas])}
                                            style={{ minWidth: '90px' }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-vp-muted flex-wrap">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-vp-cyan/20 border border-vp-cyan/40 inline-block" /> طبيعي</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-vp-amber/20 border border-vp-amber/40 inline-block" /> كميات مرتفعة (تحذير)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-vp-red/20   border border-vp-red/40   inline-block" /> قيمة خاطئة أو خطر (تنبيه حرج)</div>
            </div>

            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl border animate-fade-in-up ${toast.type === 'success' ? 'bg-black/80 border-vp-cyan/30 text-vp-cyan' : 'bg-black/80 border-vp-red/30 text-vp-red'}`}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: toast.type === 'success' ? '#6ECCDB' : '#eb5757' }}></span>
                    <span className="font-bold text-sm text-white">{toast.message}</span>
                </div>
            )}
        </div>
    );
}
