
import NextAuth from "next-auth"
import Line from "next-auth/providers/line"
import { SupabaseAdapter } from "@auth/supabase-adapter"


export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true, // Enable debug logs to investigate error
    providers: [
        Line({
            clientId: process.env.AUTH_LINE_ID,
            clientSecret: process.env.AUTH_LINE_SECRET,
            // Optional: request user profile scope
            authorization: { params: { scope: 'profile openid' } },
        }),
    ],
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                session.user.id = user.id; // Ensure user ID is passed to session
            }
            return session;
        },
    },
})
