'use client'

import React from 'react'
import OrderItem from './OrderItem'
import { Badge } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import styles from './OrderDetail.module.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
        <OrderItem
          key={idx}
          {...orderItem}
          status={status}
          receiver={receiver}
          phoneNumber={phoneNumber}
          createdAt={createdAt}
        />
      ))}
    </div>
  )
}
