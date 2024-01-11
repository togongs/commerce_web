'use client'

import React from 'react'
import { User } from '@prisma/client'
import { ChatDto } from '@/app/types/chat/chat.dto'
import { useSession } from 'next-auth/react'
import { Input } from '@mantine/core'
import styles from './Chat.module.scss'
import Image from 'next/image'
import useSWRMutation from 'swr/mutation'
import { formatTime, fromNow } from '@/constants/dayjs'

interface ConverSationProps extends User {
  conversations?: ChatDto.ConversationResponse[]
}

interface ChatProps {
  currentUser: ConverSationProps
  receiver: {
    receiverId: string
    receiverName: string
    receiverImage: string
  }
}

export default function Chat({ receiver, currentUser }: ChatProps) {
  const [message, setMessage] = React.useState('')
  const conversation = currentUser.conversations?.find((conversation) =>
    conversation.users.find((user) => user.id === conversation.receiverId),
  )
  console.log('conversation', conversation)
  const lastMessageTime = conversation?.messages
    .filter((message) => message.receiverId === currentUser.id)
    .slice(-1)[0].createdAt
  if (!receiver.receiverName) {
    return <div />
  }
  return (
    <form
      className={styles.form}
      onSubmit={async (e) => {
        e.preventDefault()
        if (message) {
          try {
            fetch('/api/chat', {
              method: 'POST',
              body: JSON.stringify({
                text: message,
                receiverId: receiver.receiverId,
                senderId: currentUser.id,
              }),
            })
          } catch (error) {
            console.error(error)
          }
        }
        setMessage('')
      }}
    >
      <div className={styles.receiverInfo}>
        <Image
          className={styles.image}
          src={receiver.receiverImage}
          width={30}
          height={30}
          alt="profile"
        />
        <div className={styles.infoContainer}>
          <h2>{receiver.receiverName}</h2>
          <span>{formatTime(lastMessageTime!)}</span>
        </div>
      </div>
      <div>
        {conversation &&
          conversation.messages.map((message) => {
            const isSender = message.senderId === currentUser.id
            return (
              <div key={message.id}>
                {isSender ? (
                  <div className={styles.sender}>
                    <div className={styles.info}>
                      <div className={styles.fBox}>
                        <span>{fromNow(message.createdAt)}</span>
                        <h3>You</h3>
                      </div>
                      <span>{message.text}</span>
                    </div>
                    <Image
                      className={styles.image}
                      src={message.sender?.image!}
                      width={30}
                      height={30}
                      alt="profile"
                    />
                  </div>
                ) : (
                  <div className={styles.receiver}>
                    <Image
                      className={styles.image}
                      src={message.sender?.image!}
                      width={30}
                      height={30}
                      alt="profile"
                    />
                    <div>
                      <div className={styles.fBox}>
                        <h3>{message.sender.name}</h3>
                        <span>{fromNow(message.createdAt)}</span>
                      </div>
                      <span>{message.text}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>
      <div className={styles.inputConatiner}>
        <Input
          type="text"
          placeholder="메시지를 작성해주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </form>
  )
}
