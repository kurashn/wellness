import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from "@/auth"; // Import auth middleware

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    // If the user is authenticated (req.auth) or not, simply pass to intlMiddleware
    // to handle locale routing. You can add protected route logic here if needed.
    return intlMiddleware(req);
});

export const config = {
    // Match only internationalized pathnames, plus auth routes
    // Note: ensure api/auth is NOT matched by intl middleware if it interferes (usually it's fine)
    matcher: ['/', '/(ja|en|th)/:path*']
};
