'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import { IconRefresh, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import styles from './page.module.scss'
import { Button } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { ProductDto } from '../types/products/products.dto'
import { useRouter } from 'next/navigation'
import { CATEGORY_MAP } from '@/constants/products'

export default function Page() {
  const router = useRouter()
  const [quantity, setQuantity] = React.useState<number>(0)

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
  // console.log('products', products)
  return (
    <div className={styles.container}>
      <p className={styles.title}>Cart (2)</p>
      <div className={styles.table}>
        <div className={styles.leftContainer}>
          <div className={styles.productContainer}>
            <Image
              className={styles.image}
              src={
                'https://cdn.shopify.com/s/files/1/0282/5850/products/footwear_jordan_aj-1-mid-se-craft_DM9652-100.view_1_720x.jpg'
              }
              width={230}
              height={230}
              alt="image"
              // onClick={() => router.psuh(`/products/${}`)}
            />
            <div className={styles.mid}>
              <span className={styles.name}>신발</span>
              <span className={styles.price}>가격: 20000 원</span>
              <div className={styles.countContainer}>
                <CountControl quantity={quantity} setQuantity={setQuantity} />
                <IconRefresh
                  onClick={() => {
                    alert('장바구니 수정')
                  }}
                />
              </div>
            </div>
            <div className={styles.priceContainer}>
              <span className={styles.sumPrice}>40000 원</span>
              <IconX
                onClick={() => {
                  alert('장바구니 삭제')
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.pd}>
            <p>Info</p>
            <div className={styles.row}>
              <span>금액</span>
              <span>0 원</span>
            </div>
            <div className={styles.row}>
              <span>배송비</span>
              <span>0 원</span>
            </div>
            <div className={styles.row}>
              <span>할인 금액</span>
              <span>0 원</span>
            </div>
            <div className={styles.row}>
              <span style={{ fontWeight: 700 }}>결제 금액</span>
              <span style={{ fontWeight: 700, color: 'red' }}>0 원</span>
            </div>
            <Button
              style={{
                backgroundColor: 'black',
                width: '100%',
                marginTop: 5,
              }}
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
      <div style={{ marginTop: 100 }}>
        <p style={{ fontWeight: 600, marginBottom: 12 }}>추천상품</p>
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
