import { ChatDto } from '@/app/types/chat/chat.dto'
import { User } from '@prisma/client'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import React from 'react'

interface ChatListProps {
  user: {
    conversations?: ChatDto.ConversationResponse[]
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
  }
}

export default function ChatList({ user }: ChatListProps) {
  const { data: session }: any = useSession()
  const messageWithCurrentUser = user?.conversations?.find((conversation) =>
    conversation.users.find((user) => user.id === session?.id),
  )
  const latestMessage = messageWithCurrentUser?.messages.slice(-1)[0]
  return (
    <div>
      <div></div>
      <div>
        <h3>{user.name}</h3>
        {latestMessage && <p>{latestMessage.text}</p>}
      </div>
      <div>
        {latestMessage && (
          <p>{dayjs(latestMessage.createdAt).format('YYYY.MM.DD')}</p>
        )}
      </div>
    </div>
  )
}
