import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

interface Session {
  id?: string
  user: {
    name?: string
    email?: string
    image?: string
  }
}

export async function POST(request: Request): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const body = await request.json()
  const { item } = body
  console.log('item????', item)
  // if (session?.id !== item.userId) return null
  try {
    const response = await prisma.cart.update({
      where: {
        id: item.id,
      },
      data: {
        quantity: item.quantity,
        amount: item.amount,
      },
    })
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
