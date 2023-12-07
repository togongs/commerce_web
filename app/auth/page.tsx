'use client'

import { GoogleLogin } from '@react-oauth/google'

export default function Page() {
  return (
    <div style={{ display: 'flex' }}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          fetch(`/api/auth`, {
            method: 'POST',
            body: JSON.stringify({
              credential: credentialResponse.credential,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
        }}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </div>
  )
}
