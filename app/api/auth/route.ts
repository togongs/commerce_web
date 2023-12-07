import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { jwtDecode } from 'jwt-decode'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { credential } = body
  const decoded: { name: string; email: string; picture: string } =
    jwtDecode(credential)
  const response = await prisma.user.upsert({
    where: {
      email: decoded.email,
    },
    update: {
      name: decoded.name,
      image: decoded.picture,
    },
    create: {
      email: decoded.email,
      name: decoded.name,
      image: decoded.picture,
    },
  })
  return NextResponse.json(response)
}
