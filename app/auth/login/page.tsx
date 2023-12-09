import GoogleLogin from '@/components/GoogleLogin'
import styles from './page.module.scss'

export default function Page() {
  return (
    <div className={styles.container}>
      <GoogleLogin />
    </div>
  )
}
