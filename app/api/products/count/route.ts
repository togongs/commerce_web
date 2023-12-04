import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, params: { id: number }) {
  const response = await prisma.products.count()
  return NextResponse.json(response)
}
