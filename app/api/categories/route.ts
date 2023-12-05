import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, params: { id: number }) {
  const response = await prisma.categories.findMany()
  return NextResponse.json(response)
}

export async function POST(request: Request) {
  //   const body = await request.json()
  //   const { id, contents, skip, take } = body
  // return NextResponse.json(response)
}
