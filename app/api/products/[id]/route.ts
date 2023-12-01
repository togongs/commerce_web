import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: any,
  { params }: { params: { id: number } },
) {
  const { id } = params
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: Number(id),
      },
    })
    if (!response) return null
    return NextResponse.json(response)
  } catch (error: any) {
    throw new Error(error)
  }
}
