'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { CLIENT_ID } from '@/constants/googleAuth'

export interface ProvidersProps {
  children?: React.ReactNode
  session?: Session | null
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
})
export default function Providers({ children, session }: ProvidersProps) {
  return (
    // <GoogleOAuthProvider clientId={CLIENT_ID}>
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
    // </GoogleOAuthProvider>
  )
}
