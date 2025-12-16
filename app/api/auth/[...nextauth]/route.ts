import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Create user in DB if not exists
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", user.email)
        .single()

      if (!data) {
        await supabase.from("users").insert({
          email: user.email,
          name: user.name,
        })
      }

      return true
    },

    async session({ session }) {
      // Attach payment status to session
      const { data } = await supabase
        .from("users")
        .select("id, has_paid")
        .eq("email", session.user.email)
        .single()

      session.user.id = data.id
      session.user.hasPaid = data.has_paid

      return session
    },
  },
})

export { handler as GET, handler as POST }
