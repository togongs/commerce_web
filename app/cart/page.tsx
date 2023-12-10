'use client'

import React from 'react'
import CountControl from '@/components/CountControl'
import { IconRefresh, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import styles from './page.module.scss'

export default function Page() {
  const [quantity, setQuantity] = React.useState<number>(0)
  return (
    <div className={styles.container}>
      <span>Cart (2)</span>
      <div className={styles.table}>
        <div className={styles.leftContainer}>
          <div className={styles.productContainer}>
            <Image
              src={
                'https://cdn.shopify.com/s/files/1/0282/5850/products/footwear_jordan_aj-1-mid-se-craft_DM9652-100.view_1_720x.jpg'
              }
              width={155}
              height={195}
              alt="image"
            />
            <div className={styles.mid}>
              <span className={styles.name}>신발</span>
              <span className={styles.price}>가격: 20000 원</span>
              <div className={styles.countContainer}>
                <CountControl quantity={quantity} setQuantity={setQuantity} />
                <IconRefresh />
              </div>
            </div>
            <div className={styles.priceContainer}>
              <span className={styles.sumPrice}>40000 원</span>
              <IconX />
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
              <span>금액</span>
              <span>0 원</span>
            </div>
            <div className={styles.row}>
              <span>금액</span>
              <span>0 원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
