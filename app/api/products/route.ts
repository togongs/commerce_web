import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, params: { id: number }) {
  const { id } = params
  if (params.id) {
    try {
      const response = await prisma.products.findUnique({
        where: {
          id: id,
        },
      })
      if (!response) return null
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
  const { id, contents, skip, take, category } = body
  console.log('category', category)
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
      if (!response) return null
      return NextResponse.json(response)
    } catch (error: any) {
      throw new Error(error)
    }
  } else {
    const where =
      category && category !== -1
        ? {
            where: {
              category_id: category,
            },
          }
        : undefined
    const response = await prisma.products.findMany({
      skip,
      take,
      ...where,
      orderBy: {
        price: 'desc',
      },
    })
    return NextResponse.json(response)
  }
}
