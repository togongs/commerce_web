'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Chat from '@/components/chat/Chat'
import { redirect } from 'next/navigation'
import ChatList from '@/components/chat/ChatList'
import { User } from '@prisma/client'

export default function Page() {
  const { data: session } = useSession()
  const [receiver, setReceiver] = React.useState({
    receiverId: '',
    receiverName: '',
    receiverImage: '',
  })

  const { data: users } = useQuery<any, any, User[]>([`chat`], () =>
    fetch(`/api/chat`).then((res) => res.json()),
  )
  console.log('users', users)
  //   현재 유저
  const currentUser = users?.find(
    (user: any) => user.email === session?.user?.email,
  )

  if (session === null) redirect('/auth/login')
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <section style={{ flex: 1 }}>
          <h1>채팅목록</h1>
          <div>
            {users &&
              users.length > 0 &&
              users
                .filter((user) => user.id !== currentUser?.id)
                .map((user) => {
                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        setReceiver({
                          receiverId: user.id || '',
                          receiverName: user.name || '',
                          receiverImage: user.image || '',
                        })
                      }}
                    >
                      <ChatList user={user} />
                    </div>
                  )
                })}
            {/* </div> */}
          </div>
        </section>
        <section style={{ width: '50%' }}>
          {users && <Chat users={users[0]} receiver={receiver} />}
        </section>
      </div>
    </div>
  )
}
