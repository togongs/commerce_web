'use client'

import React from 'react'
import styles from './page.module.scss'
import OrderItem from './OrderItem'
import { OrdersDto } from '../types/orders/orders.dto'

const ORDER_STATUS_MAP = [
  '주문취소',
  '주문대기',
  '결제대기',
  '결제완료',
  '배송대기',
  '배송중',
  '배송완료',
  '환불대기',
  '환불완료',
  '반품대기',
  '반품완료',
]

interface OrderDetailProps extends OrdersDto.OrdersResponse {
  orderItems: {
    amount: number
    id: number
    image_url: string
    name: string
    price: number
    productId: number
    quantity: number
  }[]
  userId: string
}
export default function OrderDetail(item: OrderDetailProps) {
  return (
    <div className={styles.orderContainer}>
      <div>
        <span>{ORDER_STATUS_MAP[item.status + 1]}</span>
        {item.orderItems.map((orderItem, idx) => (
          <OrderItem key={idx} {...orderItem} />
        ))}
      </div>
    </div>
  )
}
