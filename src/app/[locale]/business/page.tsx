import { useTranslations } from 'next-intl';

export default function BusinessPage() {
    const t = useTranslations('nav');

    return (
        <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold font-exo text-primary mb-6">{t('business')}</h1>
            <p className="text-xl text-gray-600">Coming Soon</p>
        </div>
    );
}
