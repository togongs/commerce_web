'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import Image from 'next/image'
import styles from './OrderItem.module.scss'
// import {  useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Button } from '@mantine/core'

interface OrderItemProps {
  amount: number
  id: number
  image_url: string
  name: string
  price: number
  productId: number
  quantity: number
  status: number
}

export default function OrderItem({
  id,
  image_url,
  productId,
  name,
  price,
  quantity,
  status,
}: OrderItemProps) {
  const router = useRouter()
  const [qty, setQuantity] = React.useState<number | string>(quantity)
  // const queryClient = useQueryClient()

  return (
    <div className={styles.itemContainer}>
      <Image
        className={styles.image}
        src={image_url}
        width={230}
        height={230}
        alt="image"
        onClick={() => router.push(`/products/${productId}`)}
      />
      <div className={styles.mid}>
        <span className={styles.name}>{name}</span>
        <span className={styles.price}>가격: {price.toLocaleString()}원</span>
        <div className={styles.countContainer}>
          <CountControl value={qty} setValue={setQuantity} />
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.sumPrice}>
          {(price * Number(qty)).toLocaleString()} 원
        </span>
        {status === 5 && (
          <Button
            className={styles.btn}
            onClick={() => {
              router.push(`/comment/edit?orderItemId=${id}`)
            }}
          >
            후기작성
          </Button>
        )}
      </div>
    </div>
  )
}
