import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, params: { id: number }) {
  const response = await prisma.products.count()
  return NextResponse.json(response)
}
export async function POST(request: Request, params: { id: number }) {
  const body = await request.json()
  const { category } = body
  const where =
    category && category !== -1
      ? {
          where: {
            category_id: category,
          },
        }
      : undefined
  const response = await prisma.products.count(where)
  return NextResponse.json(response)
}
