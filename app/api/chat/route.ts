import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma: any = new PrismaClient()

export async function GET(request: Request) {
  const users = await prisma.user.findMany({
    include: {
      conversations: {
        include: {
          messages: {
            include: {
              sender: true,
              receiver: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          users: true,
        },
      },
    },
  })
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  console.log('body', body)
  const conversation = await prisma.conversation.findFirst({
    where: {
      AND: [
        {
          users: {
            some: {
              id: body.senderId,
            },
          },
        },
        {
          users: {
            some: {
              id: body.receiverId,
            },
          },
        },
      ],
    },
  })
  if (conversation) {
    try {
      const message = await prisma.message.create({
        data: {
          text: body.text,
          //   image: body.image,
          senderId: body.senderId,
          receiverId: body.receiverId,
          conversationId: conversation.id,
        },
      })
      return NextResponse.json(message)
    } catch (error) {
      return NextResponse.json(error)
    }
  } else {
    const newConversation = await prisma.conversation.create({
      data: {
        senderId: body.senderId,
        receiverId: body.receiverId,
        users: {
          connect: [
            {
              id: body.senderId,
            },
            {
              id: body.receiverId,
            },
          ],
        },
      },
    })
    console.log('newConversation', newConversation)

    try {
      const message = await prisma.message.create({
        data: {
          text: body.text,
          //   image: body.image,
          senderId: body.senderId,
          receiverId: body.receiverId,
          conversationId: newConversation.id,
        },
      })
      return NextResponse.json(message)
    } catch (error) {
      return NextResponse.json(error)
    }
  }
}
