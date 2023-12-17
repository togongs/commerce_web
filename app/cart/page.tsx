'use client'

import React from 'react'
import Image from 'next/image'
import styles from './page.module.scss'
import { Button } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { ProductDto } from '../types/products/products.dto'
import { useRouter } from 'next/navigation'
import { CATEGORY_MAP } from '@/constants/products'
import { CarttDto } from '../types/cart/cart.dto'
import CartItem from './CartItem'

interface CartItem extends CarttDto.Response {
  name: string
  price: number
  image_url: string
}

export default function Page() {
  const router = useRouter()
  const { data } = useQuery<{ items: CartItem[] }, any, CartItem[]>(
    [`/api/cart`],
    () => fetch(`/api/cart`).then((res) => res.json()),
  )

  const { data: products } = useQuery<any, any, ProductDto.Response[]>(
    [`/api/products`],
    () =>
      fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify({
          skip: 0,
          take: 3,
        }),
      }).then((res) => res.json()),
  )
  const dilveryAmount = data && data.length > 0 ? 5000 : 0
  const discountAmount = 0
  const price = React.useMemo(
    () =>
      data?.map((item) => item.amount).reduce((prev, curr) => prev + curr, 0) ??
      0,
    [data],
  )
  return (
    <div className={styles.container}>
      <p className={styles.title}>Cart ({data?.length ?? 0})</p>
      <div className={styles.table}>
        <div className={styles.leftContainer}>
          {data?.map((item) => <CartItem {...item} key={item.id} />)}
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.pd}>
            <p>결제정보</p>
            <div className={styles.row}>
              <span>금액</span>
              <span>{price.toLocaleString()} 원</span>
            </div>
            <div className={styles.row}>
              <span>배송비</span>
              <span>{dilveryAmount.toLocaleString()} 원</span>
            </div>
            <div className={styles.row}>
              <span>할인 금액</span>
              <span>{discountAmount.toLocaleString()} 원</span>
            </div>
            <div className={styles.row}>
              <span className={styles.desc}>결제 금액</span>
              <span className={styles.price}>
                {(price - dilveryAmount - discountAmount).toLocaleString()} 원
              </span>
            </div>
            <Button
              className={styles.btn}
              styles={{
                root: { height: 48 },
              }}
              radius="xl"
              size="md"
              onClick={() => {
                alert('구매하기')
              }}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.recommend}>
        <p className={styles.title}>추천상품</p>
        {products && products.length > 0 ? (
          <div className={styles.imageContainer}>
            {products?.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <Image
                  className={styles.image}
                  src={item.image_url ?? ''}
                  width={200}
                  height={200}
                  alt="image"
                />
                <p>{item.name}</p>
                <p>{item.price.toLocaleString()}원</p>
                <span>{CATEGORY_MAP[item.category_id - 1]}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.notFoundContainer}>
            <h2>추천상품이 없습니다.</h2>
          </div>
        )}
      </div>
    </div>
  )
}
