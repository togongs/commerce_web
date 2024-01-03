'use client'

import React from 'react'
import {
  IconHeart,
  IconHome,
  IconLogout,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import styles from './Header.module.scss'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <IconHome className={styles.icon} onClick={() => router.push('/')} />
        <div className={styles.rightContainer}>
          <IconHeart
            className={styles.icon}
            onClick={() => router.push('/wishlist')}
          />
          <IconShoppingCart
            className={styles.icon}
            onClick={() => router.push('/cart')}
          />

          {session ? (
            <>
              <Image
                className={styles.image}
                src={session.user?.image!}
                width={30}
                height={30}
                alt="profile"
                onClick={() => router.push('/mypage')}
              />
              <IconLogout
                className={styles.icon}
                strokeWidth={2}
                color={'black'}
                onClick={() => signOut()}
              />
            </>
          ) : (
            <IconUser
              className={styles.icon}
              onClick={() => router.push('/auth/login')}
            />
          )}
        </div>
      </div>
    </header>
  )
}
