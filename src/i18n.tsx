import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'ar' | 'en';

type Translations = {
    [key in Language]: Record<string, string>;
};

const translations: Translations = {
    ar: {
        'landing.title1': 'مراقبة ذكية لجودة الهواء',
        'landing.title2': 'في الحرم الجامعي',
        'landing.desc': 'نظام متكامل يستند إلى إنترنت الأشياء (IoT) والذكاء الاصطناعي لتتبع، تحليل، وتوقع جودة الهواء والحد من انبعاثات الغازات في البيئة الأكاديمية لحظة بلحظة.',
        'landing.btn_insights': 'تصفح المؤشرات',
        'landing.btn_login': 'دخول الباحثين',
        'landing.why': 'لماذا VerdePlus؟',
        'nav.home': 'الرئيسية',
        'nav.insights': 'المؤشرات',
        'nav.admin': 'إدخال البيانات',
        'nav.sessions': 'الجلسات الحوارية',
        'nav.login': 'تسجيل الدخول',
        'nav.logout': 'تسجيل خروج',
        'nav.guest': 'زائر',
        'nav.admin_role': 'مشرف',
        'nav.researcher_role': 'باحث',
        'nav.user_role': 'مستخدم عام',
        'login.title': 'منصة مراقبة جودة الهواء في الحرم الجامعي',
        'login.email_label': 'البريد الإلكتروني للوصول السريع',
        'login.email_placeholder': 'you@verde.edu',
        'login.error': 'البريد الإلكتروني غير مسجل في النظام.',
        'login.button': 'تسجيل الدخول',
        'login.checking': 'جاري التحقق...',
        'login.hint': 'استخدم: admin@verde.edu أو researcher@verde.edu',
        'login.promo1': '✨ ميزات الباحثين',
        'login.promo2': 'يدعم النظام تسجيل الدخول السريع عبر البريد الإلكتروني.',
        'insights.title': 'لوحة المؤشرات',
        'insights.aqi': 'مؤشر جودة الهواء الإجمالي',
        'insights.campus': 'حرم جامعة حلب',
        'insights.live': 'مباشر (يتم التحديث)',
        'insights.normal': 'طبيعي',
        'insights.warning': 'تحذير',
        'insights.danger': 'خطر',
        'insights.worst': 'أكثر المناطق تلوثاً',
        'insights.challenge': 'تحدي الأقسام',
        'insights.table_title': 'جدول القراءات الحالية',
        'insights.region': 'المنطقة',
        'insights.status': 'الحالة',
        'insights.sessions': 'مخرجات الجلسات الحوارية',
        'insights.logs_title': 'السجلات والقراءات السابقة',
        'insights.logs_desc': 'تصفح التقارير التاريخية المنظمة والمخططات البيانية',
        'insights.logs_btn': 'استعراض السجلات',
        'logs.title': 'السجلات والقراءات',
        'logs.desc': 'استعرض البيانات المخزنة يومياً وشهرياً للمقارنة والتحليل والتحسين.',
        'logs.chart_title': 'المتوسط الشهري لمؤشر جودة الهواء',
        'logs.history': 'سجلات الأيام السابقة',
        'logs.report': 'تقرير يومي',
        'logs.locked_title': 'السجلات التاريخية مقفلة مؤقتاً',
        'logs.locked_desc': 'يتم حالياً دراسة البيانات لتوفير تقارير متقدمة في النسخة القادمة. ستتوفر هذه الميزة قريباً مع تقارير متقدمة وواجهات تخصيص.',
        'logs.coming_soon': 'قريباً جداً',
        'nav.logs': 'السجلات',
        'footer.rights': 'جميع الحقوق محفوظة لفريق',
        'footer.contact': 'التواصل معنا',
        'footer.website': 'موقعنا الرسمي',
        'health.good': 'الهواء نقي جداً، وقت ممتاز للأنشطة الخارجية! 🌿',
        'health.moderate': 'جودة الهواء مقبولة. يمكن القيام بالأنشطة المعتادة. 🚶',
        'health.poor': 'الهواء ملوث قليلاً. يُنصح بتقليل الأنشطة المجهدة. 😷',
        'health.hazardous': 'خطر! هواء ملوث جداً. ابقَ في الداخل. 🚨',
        'tooltip.ch4': 'الميثان: غاز دفيئة ينتج عن التحلل العضوي.',
        'tooltip.c3h8': 'البروبان: غاز يستخدم غالباً كوقود.',
        'tooltip.h2': 'الهيدروجين: غاز خفيف جداً، يتواجد بنسب ضئيلة.',
        'level.good': 'طبيعي',
        'level.moderate': 'متوسط',
        'level.poor': 'سيء',
        'level.danger': 'خطر',
    },
    en: {
        'landing.title1': 'Smart Air Quality Monitoring',
        'landing.title2': 'on Campus',
        'landing.desc': 'An integrated IoT and AI-based system to track, analyze, predict air quality, and reduce gas emissions in the academic environment in real-time.',
        'landing.btn_insights': 'Browse Insights',
        'landing.btn_login': 'Researcher Login',
        'landing.why': 'Why VerdePlus?',
        'nav.home': 'Home',
        'nav.insights': 'Insights',
        'nav.admin': 'Data Entry',
        'nav.sessions': 'Sessions',
        'nav.login': 'Login',
        'nav.logout': 'Logout',
        'nav.guest': 'Guest',
        'nav.admin_role': 'Admin',
        'nav.researcher_role': 'Researcher',
        'nav.user_role': 'General User',
        'login.title': 'Campus Air Quality Monitoring Platform',
        'login.email_label': 'Quick Access Email',
        'login.email_placeholder': 'you@verde.edu',
        'login.error': 'Email not registered in the system.',
        'login.button': 'Login',
        'login.checking': 'Verifying...',
        'login.hint': 'Try: admin@verde.edu or researcher@verde.edu',
        'login.promo1': '✨ Premium Features',
        'login.promo2': 'Using passwordless email login for quick access.',
        'insights.title': 'Insights Dashboard',
        'insights.aqi': 'Overall Air Quality Index',
        'insights.campus': 'Aleppo University Campus',
        'insights.live': 'Live (Updating)',
        'insights.normal': 'Normal',
        'insights.warning': 'Warning',
        'insights.danger': 'Danger',
        'insights.worst': 'Most Polluted Zones',
        'insights.challenge': 'Department Challenge',
        'insights.table_title': 'Current Readings Table',
        'insights.region': 'Region',
        'insights.status': 'Status',
        'insights.sessions': 'Session Outcomes',
        'insights.logs_title': 'Historical Logs & Readings',
        'insights.logs_desc': 'Browse structured historical reports and charts',
        'insights.logs_btn': 'View Logs',
        'logs.title': 'Logs & Readings',
        'logs.desc': 'Review daily and monthly stored data for comparison, analysis, and improvement.',
        'logs.chart_title': 'Monthly Average AQI',
        'logs.history': 'Previous Days Logs',
        'logs.report': 'Daily Report',
        'logs.locked_title': 'Historical Logs Currently Locked',
        'logs.locked_desc': 'We are currently analyzing data to provide advanced reporting in the next version. This feature will be unlocked soon.',
        'logs.coming_soon': 'Coming Soon',
        'nav.logs': 'Logs',
        'footer.rights': 'All rights reserved to',
        'footer.contact': 'Contact Us',
        'footer.website': 'Our Official Website',
        'health.good': 'Air is very clean. Great time for outdoor activities! 🌿',
        'health.moderate': 'Air quality is acceptable. Normal activities are fine. 🚶',
        'health.poor': 'Air is slightly polluted. Reduce heavy exertion. 😷',
        'health.hazardous': 'Hazardous! Very polluted air. Stay indoors. 🚨',
        'tooltip.ch4': 'Methane: Greenhouse gas from organic decay.',
        'tooltip.c3h8': 'Propane: Gas often used as fuel.',
        'tooltip.h2': 'Hydrogen: Very light gas, present in trace amounts.',
        'level.good': 'Good',
        'level.moderate': 'Moderate',
        'level.poor': 'Poor',
        'level.danger': 'Danger',
    }
};

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('ar');

    const t = (key: string) => {
        return translations[lang][key] || key;
    };

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen ${lang === 'ar' ? 'font-cairo' : 'font-inter'}`}>
                {children}
            </div>
        </I18nContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}
