'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import Image from 'next/image'
import styles from './OrderItem.module.scss'
// import {  useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface OrderItemProps {
  amount: number
  id: number
  image_url: string
  name: string
  price: number
  productId: number
  quantity: number
}

export default function OrderItem(item: OrderItemProps) {
  const router = useRouter()
  const [quantity, setQuantity] = React.useState<number | string>(item.quantity)
  // const queryClient = useQueryClient()

  return (
    <div className={styles.itemContainer}>
      <Image
        className={styles.image}
        src={item.image_url}
        width={230}
        height={230}
        alt="image"
        onClick={() => router.push(`/products/${item.productId}`)}
      />
      <div className={styles.mid}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>
          가격: {item.price.toLocaleString()}원
        </span>
        <div className={styles.countContainer}>
          <CountControl value={quantity} setValue={setQuantity} />
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.sumPrice}>
          {(item.price * Number(quantity)).toLocaleString()} 원
        </span>
      </div>
    </div>
  )
}
