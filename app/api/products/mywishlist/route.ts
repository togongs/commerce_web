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

export async function GET(): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId: session?.id,
    },
  })

  const productsId = wishlist?.productIds.split(',').map((item) => Number(item))

  if (productsId && productsId.length > 0) {
    const response = await prisma.products.findMany({
      where: {
        id: {
          in: productsId,
        },
      },
    })
    return NextResponse.json(response)
  }
  return new NextResponse(null, { status: 200 })
}
