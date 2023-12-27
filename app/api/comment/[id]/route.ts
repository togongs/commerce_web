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

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const { id } = params
  const response = await prisma.comment.findUnique({
    where: {
      orderItemId: Number(id),
    },
  })
  // if (response?.userId !== session?.id) {
  //   return new Response(null, { status: 404 })
  // }
  return NextResponse.json(response)
}
