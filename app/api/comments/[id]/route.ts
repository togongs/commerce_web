import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const { id } = params
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId: Number(id),
      },
    })
    let response = []
    // orderItemId를 기반으로 Comment를 조회
    for (const orderItem of orderItems) {
      const res = await prisma.comment.findUnique({
        where: {
          orderItemId: orderItem.id,
        },
      })
      if (res) {
        response.push({ ...orderItem, ...res })
      }
    }
    if (!response) return new Response(null, { status: 404 })
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
