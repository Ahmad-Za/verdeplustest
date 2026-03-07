import { useState } from 'react';
import { SESSION_CARDS } from '../data';

const ALL_TAGS = ['كل الجلسات', 'طاقة متجددة', 'هندسة عمارة', 'انبعاثات'];

export default function SessionsPage() {
    const [activeTag, setActiveTag] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filtered = SESSION_CARDS.filter(s => {
        const matchTag = !activeTag || s.tag === activeTag;
        const matchSearch = !search || s.title.includes(search) || s.tldr.some(t => t.includes(search));
        return matchTag && matchSearch;
    });

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">📚 مخرجات الجلسات الحوارية</h2>
            <p className="text-vp-muted text-sm mb-6">قاعدة بيانات مرجعية للتوصيات البيئية من جلسات الطلاب والباحثين</p>

            {/* Search + Filter */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                <input
                    type="text"
                    placeholder="ابحث في الجلسات..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="data-input flex-1 min-w-[200px] max-w-xs"
                />
                <div className="flex gap-2 flex-wrap">
                    {ALL_TAGS.map(t => (
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

            {filtered.length === 0 && (
                <div className="glass-card p-12 text-center text-vp-muted">
                    لا توجد نتائج تطابق بحثك.
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
                {filtered.map(s => (
                    <div key={s.id} className="glass-card p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-2">
                            <span className="tag-btn active text-xs">{s.tag}</span>
                            <span className="text-vp-muted text-xs shrink-0">{s.date}</span>
                        </div>
                        <h3 className="font-semibold leading-snug">{s.title}</h3>
                        <div className="space-y-2">
                            <p className="text-xs text-vp-muted font-semibold uppercase tracking-wider">TL;DR — الخلاصة السريعة</p>
                            {s.tldr.map((t, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <span className="text-vp-cyan text-xs mt-0.5 shrink-0">✓</span>
                                    <p className="text-sm text-vp-muted">{t}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                            <p className="text-xs text-vp-muted/60">🎓 {s.dept}</p>
                            <button className="text-xs text-vp-cyan/70 hover:text-vp-cyan transition-colors">
                                قراءة التقرير الكامل ←
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

