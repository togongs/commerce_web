import { User } from '@prisma/client'

export namespace ChatDto {
  export interface ConversationResponse {
    id: string
    name: string
    senderId: string
    receiverId: string
    users: User[]
    messages: ChatDto.MessageResponse[]
    createdAt: string
  }
  export interface MessageResponse {
    id: string
    createdAt: string
    updatedAt: string
    text: string
    image: string
    sender: User
    senderId: string
    receiver: User
    receiverId: string
    conversation: ChatDto.ConversationResponse[]
    conversationId: String
  }
}
