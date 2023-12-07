'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { CLIENT_ID } from '@/constants/googleAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
})
export default function Providers({ children }: any) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
