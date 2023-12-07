import GoogleLogin from '@/components/GoogleLogin'

export default function Page() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100vh',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GoogleLogin />
    </div>
  )
}
