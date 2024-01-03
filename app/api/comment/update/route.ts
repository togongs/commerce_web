import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

interface Session {
  id: string
  user: {
    name: string
    email: string
    image: string
  }
}

const prisma = new PrismaClient()

export async function POST(request: Request): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const body = await request.json()
  const { orderItemId, rate, contents, images } = body
  try {
    const response = await prisma.comment.upsert({
      where: {
        orderItemId,
      },
      update: {
        contents,
        rate,
      },
      create: {
        userId: session?.id as string,
        orderItemId,
        contents,
        rate,
        images,
      },
    })
    console.log('response', response)
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
