'use client'

import React from 'react'
import OrderItem from './OrderItem'
import { Badge } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'
import styles from './OrderDetail.module.scss'
import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { CartDto } from '../types/cart/cart.dto'
import Script from 'next/script'

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
  const { data: session } = useSession()
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
  const totalPrice = React.useMemo(
    () =>
      orderItems.map((item) => item.amount).reduce((acc, cur) => acc + cur, 0),
    [orderItems],
  )
  const itemNames = React.useMemo(() => {
    return orderItems.map((item) => item.name)
  }, [orderItems])
  const [totalP, setTotalPrice] = React.useState<string | number>()
  const [orderItemName, setOrderItemName] = React.useState<string[]>()

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
            console.log('form????', form)
            try {
              console.log('haha')
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
          e.preventDefault()
          // @ts-ignore
          jsf__pay(document.order_info)
        }}
      >
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
            <OrderItem key={idx} {...orderItem} status={status} />
          ))}
          <div className={styles.infoContainer}>
            <div className={styles.infoLeft}>
              <span>주문 정보</span>
              <span>받는 사람 : {receiver ?? session?.user?.name}</span>
              <span>연락처 : {phoneNumber ?? session?.user?.email}</span>
            </div>
            <div className={styles.infoRight}>
              <span className={styles.total}>
                합계금액:{' '}
                <span className={styles.price}>
                  {totalPrice.toLocaleString()} 원
                </span>
              </span>
              <span className={styles.day}>
                주문일자: {dayjs(createdAt).format('YYYY. MM. DD')}
              </span>
              <Button
                type="submit"
                className={styles.btn}
                onClick={() => {
                  setTotalPrice(totalPrice)
                  setOrderItemName(itemNames)
                  updateMutation.mutate(5)
                }}
              >
                결제처리
              </Button>
            </div>
          </div>
          <input type="hidden" name="ordr_idxx" value="TEST12345" />
          <input type="hidden" name="good_name" value={orderItemName} />
          <input type="hidden" name="good_mny" value={totalP ?? ''} />
          <input
            type="hidden"
            name="buyr_name"
            value={receiver ?? session?.user?.name}
          />
          <input type="hidden" name="buyr_tel2" value="010-0000-0000" />
          <input
            type="hidden"
            name="buyr_mail"
            value={phoneNumber ?? session?.user?.email}
          />
          <input type="hidden" name="pay_method" value="001000000000" />
          <input type="hidden" name="site_cd" value="T0000" />
          <input type="hidden" name="site_name" value="TEST SITE" />
          <input type="hidden" name="res_cd" value="" />
          <input type="hidden" name="res_msg" value="" />
          <input type="hidden" name="enc_info" value="" />
          <input type="hidden" name="enc_data" value="" />
          <input type="hidden" name="ret_pay_method" value="" />
          <input type="hidden" name="tran_cd" value="" />
          <input type="hidden" name="use_pay_method" value="" />
        </div>
      </form>
    </>
  )
}
