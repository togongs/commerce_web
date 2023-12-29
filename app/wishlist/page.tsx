'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './page.module.scss'
import { ProductDto } from '../types/products/products.dto'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CATEGORY_MAP } from '@/constants/products'

export default function Page() {
  const router = useRouter()
  const { data: products } = useQuery<any, any, ProductDto.Response[]>(
    [`/api/products/mywishlist`],
    () => fetch(`/api/products/mywishlist`).then((res) => res.json()),
  )
  return (
    <div className={styles.container}>
      <p className={styles.title}>내가 찜한 상품</p>
      {products && products.length > 0 ? (
        <div className={styles.imageContainer}>
          {products?.map((item) => (
            <div
              className={styles.box}
              key={item.id}
              onClick={() => router.push(`/products/${item.id}`)}
            >
              <Image
                className={styles.image}
                src={item.image_url ?? ''}
                width={300}
                height={300}
                alt="image"
              />
              <p>{item.name}</p>
              <p>{(Math.ceil(item.price / 100) * 100).toLocaleString()}원</p>
              <span>{CATEGORY_MAP[item.category_id - 1]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.notFoundContainer}>
          <h2>찜한 상품이 없습니다.</h2>
        </div>
      )}
    </div>
  )
}
