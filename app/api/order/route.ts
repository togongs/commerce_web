import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { OrdersDto } from '@/app/types/orders/orders.dto'

const prisma = new PrismaClient()

interface Session {
  id: string
  user: {
    name: string
    email: string
    image: string
  }
}

export async function GET() {
  const session: Session | null = await getServerSession(authOptions)
  // orders 테이블에서 나의 주문 조회
  const orders = await prisma.orders.findMany({
    where: {
      userId: session?.id,
    },
  })
  let response = []
  // orders 안에 있는 orderItemIds로 orderItem을 꺼내고 products 테이블에서 정보를 조합
  for (const order of orders) {
    let orderItems: OrdersDto.OrderItemResponse[] = []
    for (const id of order.orderItemIds
      .split(',')
      .map((item) => Number(item))) {
      const res: OrdersDto.OrderItemResponse[] =
        await prisma.$queryRaw`select i.id, quantity, amount, i.price, name, image_url, productId from OrderItem as i join products as p on i.productId=p.id where i.id=${id};`
      orderItems.push.apply(orderItems, res)
    }
    response.push({ ...order, orderItems })
  }
  if (!response) return new Response(null, { status: 404 })
  return NextResponse.json(response)
}

export async function POST(request: Request): Promise<Response> {
  const session: Session | null = await getServerSession(authOptions)
  const body = await request.json()
  // console.log('body', body)
  const { items, orderInfo } = body
  let orderItemIds = []
  for (const item of items) {
    const orderItem = await prisma.orderItem.create({
      data: {
        ...item,
      },
    })
    console.log('orderItem', orderItem)
    orderItemIds.push(orderItem.id)
  }
  console.log('orderItemIds', orderItemIds)

  const response = await prisma.orders.create({
    data: {
      userId: session?.id,
      orderItemIds: orderItemIds.join(','),
      ...orderInfo,
      status: 0,
    },
  })
  console.log(response)
  // try {
  return NextResponse.json(response)
  // } catch (error: any) {
  //   throw new Error(error)
  // }
}
