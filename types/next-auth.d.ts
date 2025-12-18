import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      hasPaid: boolean
      email: string
      name?: string
      isPuppeteer: boolean
    }
  }
}
