'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import { IconRefresh, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import styles from './page.module.scss'

interface CartItemProps {
  amount: number
  id: number
  image_url: string
  name: string
  price: number
  quantity: number
  userId: string
}

export default function CartItem(item: CartItemProps) {
  const [quantity, setQuantity] = React.useState<number>(item.quantity)
  console.log('item', item)
  return (
    <div className={styles.productContainer}>
      <Image
        className={styles.image}
        src={item.image_url}
        width={230}
        height={230}
        alt="image"
        // onClick={() => router.psuh(`/products/${}`)}
      />
      <div className={styles.mid}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>
          가격: {item.price.toLocaleString()}원
        </span>
        <div className={styles.countContainer}>
          <CountControl value={quantity} setValue={setQuantity} />
          <IconRefresh
            onClick={() => {
              alert('장바구니 수정')
            }}
          />
        </div>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.sumPrice}>
          {(item.price * quantity).toLocaleString()} 원
        </span>
        <IconX
          onClick={() => {
            alert('장바구니 삭제')
          }}
        />
      </div>
    </div>
  )
}
