import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  params: { id: number },
): Promise<void | Response> {
  const { id } = params
  if (params.id) {
    try {
      const response = await prisma.products.findUnique({
        where: {
          id: id,
        },
      })
      if (!response) return new Response(null, { status: 404 })
      return NextResponse.json(response)
    } catch (error: any) {
      throw new Error(error)
    }
  } else {
    const response = await prisma.products.findMany()
    return NextResponse.json(response)
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, contents, skip, take, category, orderBy, keyword } = body
  if (id || contents) {
    try {
      const response = await prisma.products.update({
        where: {
          id: id,
        },
        data: {
          contents: contents,
        },
      })
      if (!response) return new Response(null, { status: 404 })
      return NextResponse.json(response)
    } catch (error: any) {
      throw new Error(error)
    }
  } else {
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

    const orderByCondition = orderBy
      ? orderBy === 'latest'
        ? { orderBy: { createdAt: 'desc' } }
        : orderBy === 'expensive'
          ? { orderBy: { price: 'desc' } }
          : { orderBy: { price: 'asc' } }
      : undefined

    const response = await prisma.products.findMany({
      skip,
      take,
      where: where,
      ...orderByCondition,
    })
    return NextResponse.json(response)
  }
}
