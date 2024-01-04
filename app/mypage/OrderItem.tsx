'use client'

import React from 'react'
import Image from 'next/image'
import styles from './OrderItem.module.scss'
// import {  useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Button } from '@mantine/core'
import Script from 'next/script'
import { useSession } from 'next-auth/react'

interface OrderItemProps {
  amount: number
  id: number
  image_url: string
  name: string
  price: number
  productId: number
  quantity: number
  status: number
  receiver: string
  phoneNumber: string
  createdAt: string
}

export default function OrderItem({
  id,
  image_url,
  productId,
  name,
  price,
  quantity,
  status,
  receiver,
  amount,
  phoneNumber,
  createdAt,
}: OrderItemProps) {
  const router = useRouter()
  const { data: session } = useSession()
  // const queryClient = useQueryClient()
  const formRef = React.useRef<HTMLFormElement | null>(null)
  React.useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://testspay.kcp.co.kr/plugin/kcp_spay_hub.js'
    formRef.current?.appendChild(script)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formRef.current?.removeChild(script)
    }
  }, [])

  return (
    <>
      <Script id="completePayment">
        {`
          function m_Completepayment(FormOrJson, closeEvent) {
            const form = document.order_info;
            GetField( form, FormOrJson );
            if (form.res_cd.value == "0000") {
              form.submit();
            } else {
              alert("[" + form.res_cd.value + "] " + form.res_msg.value);
              closeEvent();
            }
          }

          function jsf__pay(form) {
            try {
              KCP_Pay_Execute_Web(form);
            }
            catch (e) {
              alert(e);
            }
          }
        `}
      </Script>
      <form
        name="order_info"
        ref={formRef}
        onSubmit={(e) => {
          console.log('e', e)
          e.preventDefault()
          // @ts-ignore
          jsf__pay(document.order_info)
        }}
      >
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
            <span className={styles.price}>
              가격: {price.toLocaleString()}원
            </span>
            <span className={styles.price}>수량: {quantity}</span>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.sumPrice}>
              {(price * Number(quantity)).toLocaleString()} 원
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
        <div className={styles.infoContainer}>
          <div className={styles.infoLeft}>
            <span>주문 정보</span>
            <span>받는 사람 : {receiver ?? session?.user?.name}</span>
            <span>연락처 : {phoneNumber ?? session?.user?.email}</span>
          </div>
          <div className={styles.infoRight}>
            <span className={styles.total}>
              합계금액:{' '}
              <span className={styles.price}>{amount.toLocaleString()}원</span>
            </span>
            <span className={styles.day}>
              주문일자: {dayjs(createdAt).format('YYYY. MM. DD')}
            </span>
          </div>
        </div>
        <div className={styles.buy}>
          <Button
            type="submit"
            className={styles.btn}
            // onClick={() => {
            //   updateMutation.mutate(5)
            // }}
          >
            결제처리
          </Button>
        </div>
        <input type="hidden" name="ordr_idxx" value="TEST12345" />
        <input type="hidden" name="good_name" value={name} />
        <input type="hidden" name="good_mny" value={amount} />
        <input
          type="hidden"
          name="buyr_name"
          value={receiver ?? session?.user?.name}
        />
        <input type="hidden" name="buyr_tel2" value="" />
        <input
          type="hidden"
          name="buyr_mail"
          value={phoneNumber ?? session?.user?.email}
        />
        <input type="hidden" name="pay_method" value="100000000000" />
        <input type="hidden" name="site_cd" value="T0000" />
        <input type="hidden" name="site_name" value="커머스 서비스" />
        <input type="hidden" name="res_cd" value="" />
        <input type="hidden" name="res_msg" value="" />
        <input type="hidden" name="enc_info" value="" />
        <input type="hidden" name="enc_data" value="" />
        <input type="hidden" name="ret_pay_method" value="" />
        <input type="hidden" name="tran_cd" value="" />
        <input type="hidden" name="use_pay_method" value="" />
      </form>
    </>
  )
}
