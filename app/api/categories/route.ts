import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const response = await prisma.categories.findMany()
  return NextResponse.json(response)
}
