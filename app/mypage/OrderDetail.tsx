'use client'

import React from 'react'
import OrderItem from './OrderItem'
import { OrdersDto } from '../types/orders/orders.dto'
import { Badge } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import styles from './OrderDetail.module.scss'
import { Button } from '@mantine/core'

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
  console.log('item', item)
  return (
    <div className={styles.orderContainer}>
      <div className={styles.badgeContainer}>
        <Badge color={item.status === 0 ? 'red' : ''}>
          {ORDER_STATUS_MAP[item.status + 1]}
        </Badge>
        <IconX className={styles.iconX} />
      </div>
      {item.orderItems.map((orderItem, idx) => (
        <OrderItem key={idx} {...orderItem} />
      ))}
      <div className={styles.infoContainer}>
        <div className={styles.infoLeft}>
          <span>주문 정보</span>
          <span>받는사람: {item.receiver ?? ''}</span>
          <span>주소: {item.addresss ?? ''}</span>
          <span>연락처: {item.phoneNumber ?? ''}</span>
        </div>
        <div className={styles.infoRight}>
          <span className={styles.total}>
            합계금액:{' '}
            <span className={styles.price}>
              {item.orderItems
                .map((item) => item.amount)
                .reduce((acc, cur) => acc + cur, 0)
                .toLocaleString()}{' '}
              원
            </span>
          </span>
          <span className={styles.day}>
            주문일자: {dayjs(item.createdAt).format('YYYY. MM. DD')}
          </span>
          <Button className={styles.btn}>결제처리</Button>
        </div>
      </div>
    </div>
  )
}
