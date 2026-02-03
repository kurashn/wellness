import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https' as const,
                hostname: 'profile.line-scdn.net',
            },
            {
                protocol: 'https' as const,
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
