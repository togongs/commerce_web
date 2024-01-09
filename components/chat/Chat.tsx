'use client'

import React from 'react'
import { User } from '@prisma/client'
import { ChatDto } from '@/app/types/chat/chat.dto'
import { useSession } from 'next-auth/react'

interface ConverSationProps extends User {
  conversations?: ChatDto.ConversationResponse[]
}

interface ChatProps {
  users: ConverSationProps
  receiver: {
    receiverId: string
    receiverName: string
    receiverImage: string
  }
}

export default function Chat({ receiver, users }: ChatProps) {
  const { data: session }: any = useSession()
  const [message, setMessage] = React.useState('')
  const conversation = users?.conversations?.find((conversation) =>
    conversation.users.find((user) => user.id === conversation.receiverId),
  )
  return (
    <div>
      <div>
        {conversation &&
          conversation.messages.map((message) => {
            return (
              <div key={message.id}>
                {message.text && (
                  <div>
                    <p>{message.text}</p>
                  </div>
                )}
              </div>
            )
          })}
      </div>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (message) {
              try {
                await fetch('/api/chat', {
                  method: 'POST',
                  body: JSON.stringify({
                    text: message,
                    receiverId: receiver.receiverId,
                    senderId: session?.id,
                  }),
                })
              } catch (error) {
                console.error(error)
              }
            }
            setMessage('')
          }}
        >
          <input
            type="text"
            placeholder="메시지를 작성해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  )
}
