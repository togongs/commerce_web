import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

const prisma = new PrismaClient()

interface Session {
  id: string
  user: {
    name: string
    email: string
    image: string
  }
}

export async function GET() {
  const session: Session | null = await getServerSession(authOptions)
  if (session) {
    const response = await prisma.wishlist.findUnique({
      where: {
        userId: session?.id,
      },
    })
    if (!response) return new Response(null, { status: 404 })
    return NextResponse.json(response?.productIds.split(','))
  } else {
    return new Response(null, { status: 200 })
  }
}

export async function POST(request: Request): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const body = await request.json()
  const { productId } = body
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: session?.id,
      },
    })
    const originWishlist =
      wishlist?.productIds != null && wishlist.productIds !== ''
        ? wishlist.productIds.split(',')
        : []

    const isWished = originWishlist.includes(productId)

    const newWishlist = isWished
      ? originWishlist.filter((id) => id !== productId)
      : [...originWishlist, productId]

    const response = await prisma.wishlist.upsert({
      where: {
        userId: session?.id,
      },
      update: {
        productIds: newWishlist.join(','),
      },
      create: {
        userId: session?.id as string,
        productIds: newWishlist.join(','),
      },
    })
    return NextResponse.json(response?.productIds.split(','))
  } catch (error: any) {
    throw new Error(error)
  }
}
