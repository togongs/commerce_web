'use client'

import React from 'react'
import { IconHome, IconShoppingCart, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import styles from './Header.module.scss'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <IconHome style={{ height: 30 }} onClick={() => router.push('/')} />
        <div className={styles.rightContainer}>
          <IconShoppingCart
            style={{ height: 30 }}
            className={styles.cartBtn}
            onClick={() => router.push('/cart')}
          />
          {session ? (
            <Image
              src={session.user?.image!}
              width={30}
              height={30}
              style={{ borderRadius: '50%', width: 30, height: 30 }}
              alt="profile"
              onClick={() => router.push('/my')}
            />
          ) : (
            <IconUser
              style={{ height: 30 }}
              onClick={() => router.push('/auth/login')}
            />
          )}
        </div>
      </div>
    </header>
  )
}
