import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { CLIENT_ID } from '@/constants/googleAuth'

const prisma = new PrismaClient()

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: process.env.SECRET as string,
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 1 * 24 * 60 * 60, // 1 days
  },
}

export default NextAuth(authOptions)
