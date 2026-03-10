import { useI18n } from '../i18n';

export default function Footer() {
    const { t } = useI18n();
    return (
        <footer className="mt-auto border-t border-white/10 bg-black/40 py-12 relative z-20 overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-vp-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-vp-muted relative z-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/verdeplus cyan.png" alt="VerdePlus" className="h-12 object-contain" />
                    </div>
                    <p className="text-sm leading-relaxed max-w-sm">
                        نظام مراقبة جودة الهواء الذكي باستخدام إنترنت الأشياء، للحفاظ على بيئة جامعية مستدامة وصحية.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm tracking-widest">{t('nav.home')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#insights" className="hover:text-vp-cyan transition-colors">{t('nav.insights')}</a></li>
                        <li><a href="#map" className="hover:text-vp-cyan transition-colors">{t('nav.map')}</a></li>
                        <li><a href="#logs" className="hover:text-vp-cyan transition-colors">{t('nav.logs')}</a></li>
                        <li><a href="#sessions" className="hover:text-vp-cyan transition-colors">{t('nav.sessions')}</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm tracking-widest">{t('footer.contact')}</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="mailto:pyplusplus@hotmail.com" className="hover:text-vp-cyan transition-colors">pyplusplus@hotmail.com</a></li>
                        <li><a href="#" className="hover:text-vp-cyan transition-colors">الموقع الرسمي لفريق PyPlusPlus</a></li>
                        <li><a href="#" className="hover:text-vp-cyan transition-colors">انضم لمهمتنا</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col gap-4 md:flex-row items-center justify-between text-xs text-vp-muted/60 relative z-10">
                <div className="flex flex-col gap-1 text-center md:text-right">
                    <p>
                        جميع الحقوق محفوظة لفريق PyPlusPlus &copy; 2026
                    </p>
                    <p className="font-bold text-vp-cyan/80 tracking-wide text-sm">
                        مشروع VerdePlus: من حلب.. لكل سوريا.
                    </p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-vp-cyan transition-colors">Privacy</a>
                    <a href="#" className="hover:text-vp-cyan transition-colors">Terms</a>
                </div>
            </div>
        </footer>
    );
}

