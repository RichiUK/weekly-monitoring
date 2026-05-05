import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Allow access to the whole @humanforest.co.uk domain,
// or override with a single specific email via ALLOWED_EMAIL.
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN ?? "humanforest.co.uk"
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn({ profile }) {
      const email = profile?.email ?? ""
      if (!email) return false
      if (ALLOWED_EMAIL) return email === ALLOWED_EMAIL
      return email.endsWith(`@${ALLOWED_DOMAIN}`)
    },
  },
})
