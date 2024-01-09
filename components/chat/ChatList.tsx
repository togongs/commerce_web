import { ChatDto } from '@/app/types/chat/chat.dto'
import dayjs from 'dayjs'
import Image from 'next/image'
import styles from './ChatList.module.scss'
import React from 'react'

interface ChatListProps {
  currentUserId: string
  user: {
    conversations?: ChatDto.ConversationResponse[]
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
  }
}

export default function ChatList({ user, currentUserId }: ChatListProps) {
  const messageWithCurrentUser = user.conversations?.find((conversation) =>
    conversation.users.find((user) => user.id === currentUserId),
  )
  const latestMessage = messageWithCurrentUser?.messages.slice(-1)[0]
  return (
    <div style={{ display: 'flex' }}>
      <Image
        className={styles.image}
        src={user?.image!}
        width={30}
        height={30}
        alt="profile"
      />
      <div style={{ flex: 1 }}>
        <h3>{user.name}</h3>
        {latestMessage && <p>{latestMessage.text}</p>}
      </div>
      <div>
        {latestMessage && (
          <p>{dayjs(latestMessage.createdAt).format('YY.MM.DD HH:MM')}</p>
        )}
      </div>
    </div>
  )
}
