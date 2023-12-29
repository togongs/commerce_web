'use client'

import React from 'react'
import OrderItem from './OrderItem'
import { OrdersDto } from '../types/orders/orders.dto'
import { Badge } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import styles from './OrderDetail.module.scss'
import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CartDto } from '../types/cart/cart.dto'

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

interface OrderDetailProps {
  id: number
  receiver: string
  phoneNumber: string
  createdAt: string
  status: number
  userId: string
  orderItems: {
    amount: number
    id: number
    image_url: string
    name: string
    price: number
    productId: number
    quantity: number
  }[]
}
export default function OrderDetail({
  id,
  orderItems,
  receiver,
  phoneNumber,
  userId,
  createdAt,
  status,
}: OrderDetailProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const updateMutation = useMutation<unknown, unknown, number, any>(
    (status) =>
      fetch(`/api/order/update`, {
        method: 'POST',
        body: JSON.stringify({ id, status, userId }),
      }).then((res) => res.json()),
    {
      onMutate: async (status) => {
        await queryClient.cancelQueries([`/api/order`])
        // Snapshot the previous value
        const previous = queryClient.getQueryData([`/api/order`])
        // Optimistically update to the new value
        queryClient.setQueryData<CartDto.Response[]>(
          [`/api/order`],
          (old) =>
            old?.map((c) => {
              if (c.id === id) {
                return { ...c, status: status }
              }
              return c
            }),
        )
        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([`/api/order`], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/order`])
      },
    },
  )
  return (
    <div className={styles.orderContainer}>
      <div className={styles.badgeContainer}>
        <Badge className={styles.badge} color={status < 1 ? 'red' : ''}>
          {ORDER_STATUS_MAP[status + 1]}
        </Badge>
        <IconX
          onClick={() => {
            updateMutation.mutate(-1)
          }}
          className={styles.iconX}
        />
      </div>
      {orderItems.map((orderItem, idx) => (
        <OrderItem key={idx} {...orderItem} status={status} />
      ))}
      <div className={styles.infoContainer}>
        <div className={styles.infoLeft}>
          <span>주문 정보</span>
          <span>받는 사람 : {receiver ?? session?.user?.name}</span>
          <span>연락처 : {phoneNumber ?? session?.user?.email}</span>
        </div>
        <div className={styles.infoRight}>
          <span className={styles.total}>
            합계금액:{' '}
            <span className={styles.price}>
              {orderItems
                .map((item) => item.amount)
                .reduce((acc, cur) => acc + cur, 0)
                .toLocaleString()}{' '}
              원
            </span>
          </span>
          <span className={styles.day}>
            주문일자: {dayjs(createdAt).format('YYYY. MM. DD')}
          </span>
          <Button
            className={styles.btn}
            onClick={() => {
              updateMutation.mutate(5)
            }}
          >
            결제처리
          </Button>
        </div>
      </div>
    </div>
  )
}
