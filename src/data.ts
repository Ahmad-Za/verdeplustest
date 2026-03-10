// Shared mock data for the entire VerdePlus app

export const REGIONS = [
    "البوابة الرئيسية",
    "كلية الهندسة الميكانيكية",
    "كلية الهندسة المعمارية",
    "كلية الهندسة الكهربائية",
    "كلية الهندسة المعلوماتية",
    "المكتبة المركزية",
    "الساحة الطلابية",
    "المطعم الجامعي",
    "المسكن الجامعي (سكن 1)",
    "المسكن الجامعي (سكن 2)"
];

export const GAS_THRESHOLDS = {
    ch4: { warn: 3.0, danger: 7.0 },
    c3h8: { warn: 2.0, danger: 5.0 },
    h2: { warn: 0.8, danger: 1.5 },
};

export const MOCK_READINGS = [
    { id: 1, date: "2026-03-06", region: "البوابة الرئيسية", ch4: 1.2, c3h8: 0.5, h2: 0.1 },
    { id: 2, date: "2026-03-06", region: "كلية الهندسة الميكانيكية", ch4: 1.5, c3h8: 0.8, h2: 0.2 },
    { id: 3, date: "2026-03-06", region: "كلية الهندسة المعمارية", ch4: 1.1, c3h8: 0.4, h2: 0.1 },
    { id: 4, date: "2026-03-06", region: "كلية الهندسة الكهربائية", ch4: 1.3, c3h8: 0.6, h2: 0.1 },
    { id: 5, date: "2026-03-06", region: "كلية الهندسة المعلوماتية", ch4: 1.0, c3h8: 0.3, h2: 0.1 },
    { id: 6, date: "2026-03-06", region: "المكتبة المركزية", ch4: 0.9, c3h8: 0.3, h2: 0.1 },
    { id: 7, date: "2026-03-06", region: "الساحة الطلابية", ch4: 4.1, c3h8: 2.8, h2: 0.9 },
    { id: 8, date: "2026-03-06", region: "المطعم الجامعي", ch4: 5.5, c3h8: 3.1, h2: 1.2 },
    { id: 9, date: "2026-03-06", region: "المسكن الجامعي (سكن 1)", ch4: 0.8, c3h8: 0.2, h2: 0.1 },
    { id: 10, date: "2026-03-06", region: "المسكن الجامعي (سكن 2)", ch4: 0.9, c3h8: 0.3, h2: 0.1 },
];

export const SPARKLINES: Record<string, number[]> = {
    ch4: [1.1, 1.4, 1.2, 2.0, 3.5, 2.1, 2.8, 2.5],
    c3h8: [0.5, 0.7, 0.6, 1.1, 2.0, 1.5, 1.8, 1.6],
    h2: [0.1, 0.1, 0.2, 0.3, 0.9, 0.6, 0.8, 0.7],
};

export const SESSION_CARDS = [
    {
        id: 1, tag: "طاقة متجددة", date: "يناير 2026",
        title: "الانتقال نحو مصادر الطاقة النظيفة في الحرم الجامعي",
        tldr: ["تطوير نظام الطاقة الشمسية على أسطح المباني", "تقليل انبعاثات الكربون بنسبة 30% بحلول 2028", "إنشاء قاعدة بيانات مفتوحة لبيانات الطاقة"],
        dept: "الهندسة الكهربائية"
    },
    {
        id: 2, tag: "هندسة عمارة", date: "فبراير 2026",
        title: "العزل الحراري وتصميم المباني الخضراء",
        tldr: ["استخدام مواد بناء محلية صديقة للبيئة", "تحسين التهوية الطبيعية لخفض الطلب على التبريد", "توثيق أفضل الممارسات في العمارة المستدامة"],
        dept: "الهندسة المعمارية"
    },
    {
        id: 3, tag: "انبعاثات", date: "فبراير 2026",
        title: "قياس وتقليل انبعاثات الغازات في الحرم",
        tldr: ["خريطة شاملة لمصادر الغازات في 10 مناطق", "بروتوكول استجابة فوري عند تجاوز العتبات", "الربط المستقبلي بأجهزة استشعار IoT في الوقت الحقيقي"],
        dept: "الهندسة المعلوماتية"
    },
];

export type UserRole = 'admin' | 'researcher' | 'visitor' | null;

export const MOCK_USERS = [
    { email: "admin@verde.edu", password: "admin123", role: "admin" as UserRole, name: "أحمد المشرف" },
    { email: "researcher@verde.edu", password: "research123", role: "researcher" as UserRole, name: "د. نور باحثة" },
];

export function getStatus(gas: string, val: number) {
    const t = GAS_THRESHOLDS[gas as keyof typeof GAS_THRESHOLDS];
    if (!t) return 'normal';
    if (val >= t.danger) return 'danger';
    if (val >= t.warn) return 'warning';
    return 'normal';
}

export function overallAQI(readings: typeof MOCK_READINGS) {
    const total = readings.reduce((s, r) => s + r.ch4 + r.c3h8 * 2 + r.h2 * 3, 0);
    const max = readings.length * (7 + 5 * 2 + 1.5 * 3);
    return Math.round((total / max) * 100);
}
