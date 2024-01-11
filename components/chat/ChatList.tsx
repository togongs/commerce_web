import { ChatDto } from '@/app/types/chat/chat.dto'
import Image from 'next/image'
import styles from './ChatList.module.scss'
import React from 'react'
import { fromNow } from '@/constants/dayjs'

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
    <div className={styles.container}>
      <Image
        className={styles.image}
        src={user?.image!}
        width={30}
        height={30}
        alt="profile"
      />
      <div className={styles.infoContainer}>
        <h3>{user.name}</h3>
        {latestMessage && <p>{latestMessage.text}</p>}
      </div>
      <div>
        {latestMessage && (
          <p className={styles.time}>{fromNow(latestMessage.createdAt)}</p>
        )}
      </div>
    </div>
  )
}
