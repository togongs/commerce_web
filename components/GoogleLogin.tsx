'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Button from './Button'
import { redirect, useRouter } from 'next/navigation'

export default function GoogleLogin() {
  const { data: session }: any = useSession()
  if (session !== null) {
    return redirect('/')
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <>
        Not signed in <br />
        <Button onClick={() => signIn()}>Sign in</Button>
      </>
    </div>
  )
}
