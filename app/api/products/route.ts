import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: any) {
  const response = await prisma.products.findMany()
  console.log(response)
  return NextResponse.json(response)
}
// async function getProducts() {
//   try {
//     const response = await prisma.products.findMany()
//     console.log(response)
//     return response
//   } catch (error) {
//     console.error(error)
//   }
// }

// type Data = {
//   items?: any
//   message: string
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//   try {
//     const products = await getProducts()
//     res.status(200).json({ items: products, message: 'Success' })
//   } catch (error) {
//     res.status(400).json({ message: 'Failed' })
//   }
// }
