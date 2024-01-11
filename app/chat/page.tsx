'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Chat from '@/components/chat/Chat'
import { redirect } from 'next/navigation'
import ChatList from '@/components/chat/ChatList'
import { User } from '@prisma/client'
import styles from './page.module.scss'

export default function Page() {
  const { data: session }: any = useSession()
  const [receiver, setReceiver] = React.useState({
    receiverId: '',
    receiverName: '',
    receiverImage: '',
  })

  const { data: users } = useQuery<any, any, User[]>([`chat`], () =>
    fetch(`/api/chat`).then((res) => res.json()),
  )
  const currentUserWithMessage = users?.find(
    (user) => user.email === session?.user?.email,
  )
  if (session === null) redirect('/auth/login')
  return (
    <div className={styles.container}>
      <section className={styles.leftSection}>
        <h1>채팅목록</h1>
        <div className={styles.chatListContainer}>
          {users &&
            users.length > 0 &&
            users
              .filter((user) => user.id !== session?.id)
              .map((user) => (
                <div
                  className={styles.list}
                  key={user.id}
                  onClick={() => {
                    setReceiver({
                      receiverId: user.id || '',
                      receiverName: user.name || '',
                      receiverImage: user.image || '',
                    })
                  }}
                >
                  <ChatList user={user} currentUserId={session?.id} />
                </div>
              ))}
        </div>
      </section>
      <section className={styles.rightSection}>
        {currentUserWithMessage && (
          <Chat currentUser={currentUserWithMessage} receiver={receiver} />
        )}
      </section>
    </div>
  )
}
