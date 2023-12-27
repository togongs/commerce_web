'use client'

import React from 'react'
import styles from './page.module.scss'
import { useQuery } from '@tanstack/react-query'
import { OrdersDto } from '../types/orders/orders.dto'
import OrderDetail from './OrderDetail'

interface OrderPageProps extends OrdersDto.OrdersResponse {
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

export default function Page() {
  const { data } = useQuery<{ items: OrderPageProps[] }, any, OrderPageProps[]>(
    [`/api/order`],
    () => fetch(`/api/order`).then((res) => res.json()),
  )

  return (
    <div className={styles.container}>
      <p className={styles.title}>주문내역 ({data?.length ?? 0})</p>
      <div className={styles.table}>
        <div className={styles.leftContainer}>
          {data && data.length > 0 ? (
            data.map((item) => <OrderDetail {...item} key={item.id} />)
          ) : (
            <div className={styles.empty}>주문내역이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  )
}
