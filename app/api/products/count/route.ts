import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, params: { id: number }) {
  const response = await prisma.products.count()
  return NextResponse.json(response)
}
export async function POST(request: Request, params: { id: number }) {
  const body = await request.json()
  const { category, keyword } = body
  const keywordCondition =
    keyword && keyword !== ''
      ? {
          name: {
            contains: keyword,
          },
        }
      : undefined
  const where =
    category && category !== -1
      ? {
          category_id: category,
          ...keywordCondition,
        }
      : keywordCondition
        ? keywordCondition
        : undefined
  const response = await prisma.products.count({
    where: where,
  })
  return NextResponse.json(response)
}
