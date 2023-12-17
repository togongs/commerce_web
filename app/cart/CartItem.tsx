'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import { IconRefresh, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import styles from './CartItem.module.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface CartItemProps {
  amount: number
  id: number
  image_url: string
  name: string
  price: number
  quantity: number | string
  productId: number
  userId: string
}

export default function CartItem(item: CartItemProps) {
  const router = useRouter()
  const [quantity, setQuantity] = React.useState<number | string>(item.quantity)
  const queryClient = useQueryClient()
  const updateMutation = useMutation<unknown, unknown, CartItemProps, any>(
    (item) =>
      fetch(`/api/cart/update`, {
        method: 'POST',
        body: JSON.stringify({ item }),
      }).then((res) => res.json()),
    {
      onMutate: async (item) => {
        await queryClient.cancelQueries([`/api/cart`])
        // Snapshot the previous value
        const previous = queryClient.getQueryData([`/api/cart`])
        // Optimistically update to the new value
        queryClient.setQueryData<CartItemProps[]>(
          [`/api/cart`],
          (old) => old?.filter((c) => c.id !== item.id).concat(item),
        )
        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueryData([`/api/cart`], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/cart`])
      },
    },
  )

  const deleteMutation = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/cart/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries([`/api/cart`])
        // Snapshot the previous value
        const previous = queryClient.getQueryData([`/api/cart`])
        // Optimistically update to the new value
        queryClient.setQueryData<CartItemProps[]>(
          [`/api/cart`],
          (old) => old?.filter((c) => c.id !== id),
        )
        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([`/api/cart`], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/cart`])
      },
    },
  )

  return (
    <div className={styles.productContainer}>
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
          <IconRefresh
            className={styles.icon}
            onClick={() => {
              updateMutation.mutate({
                ...item,
                quantity: quantity,
                amount: item.price * Number(quantity),
              })
            }}
          />
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.sumPrice}>
          {(item.price * Number(quantity)).toLocaleString()} 원
        </span>
        <IconX
          className={styles.icon}
          onClick={() => {
            deleteMutation.mutate(item.id)
          }}
        />
      </div>
    </div>
  )
}
