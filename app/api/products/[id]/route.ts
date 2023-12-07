import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: number } },
): Promise<void | Response> {
  const { id } = params
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!response) return new Response(null, { status: 404 })
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
