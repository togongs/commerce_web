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

export async function GET() {
  const session: Session | null = await getServerSession(authOptions)
  const cart =
    await prisma.$queryRaw`select c.id, userId, quantity, amount, price, name, image_url, productId from Cart as c join products as p where c.productId=p.id AND c.userId=${session?.id};`
  if (!cart) return new Response(null, { status: 404 })
  return NextResponse.json(cart)
}

export async function POST(request: Request): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const body = await request.json()
  // console.log('body', body)
  const { item } = body
  try {
    const response = await prisma.cart.create({
      data: {
        userId: session?.id as string,
        ...item,
      },
    })
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
