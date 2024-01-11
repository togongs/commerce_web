'use client'

import React from 'react'
import { ProductDto } from '@/app/types/products/products.dto'
import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw } from 'draft-js'
import Image from 'next/image'
import Carousel from 'nuka-carousel'
import { CATEGORY_MAP } from '@/constants/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './Form.module.scss'
import {
  IconHeart,
  IconHeartbeat,
  IconShoppingCart,
  IconStar,
} from '@tabler/icons-react'
import CountControl from '@/components/CountControl'
import { CartDto } from '@/app/types/cart/cart.dto'
import { OrdersDto } from '@/app/types/orders/orders.dto'
import { CommentsDto } from '@/app/types/comments/comments.dto'
import CustomImage from '@/components/CustomImage'
import { formatTime } from '@/constants/dayjs'

interface FormProps {
  product: ProductDto.Response
  comments: CommentsDto.Response[]
}

export default function Form({ product, comments }: FormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [index, setIndex] = React.useState<number>(0)
  const [quantity, setQuantity] = React.useState<number | string>(1)
  const editorState = React.useMemo(
    () =>
      product?.contents
        ? EditorState.createWithContent(
            convertFromRaw(JSON.parse(product.contents)),
          )
        : EditorState.createEmpty(),
    [product?.contents],
  )
  const queryClient = useQueryClient()
  const { data: wishlist } = useQuery([`/api/products/wishlist`], () =>
    fetch(`/api/products/wishlist`).then((res) => res.json()),
  )
  const mutation = useMutation<unknown, unknown, string>(
    (productId) =>
      fetch(`/api/products/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      }).then((res) => res.json()),
    {
      onMutate: async () => {
        await queryClient.cancelQueries([`/api/products/wishlist`])
        // Snapshot the previous value
        const previous = queryClient.getQueryData([`/api/products/wishlist`])
        // Optimistically update to the new value
        queryClient.setQueryData<string[]>([`/api/products/wishlist`], (old) =>
          old
            ? old.includes(String(product.id))
              ? old.filter((id) => id !== String(product.id))
              : old.concat(String(product.id))
            : [],
        )
        // Return a context object with the snapshotted value
        return { previous }
      },
      onSuccess: () => {
        queryClient.invalidateQueries([`/api/products/wishlist`])
      },
    },
  )
  const isWished = wishlist ? wishlist.includes(String(product.id)) : false

  const addCartMutation = useMutation<
    unknown,
    unknown,
    Omit<CartDto.Response, 'id' | 'userId'>, // id, userId는 db에서 생성
    any
  >(
    (item) =>
      fetch(`/api/cart`, {
        method: 'POST',
        body: JSON.stringify({ item }),
      }).then((res) => res.json()),
    {
      onMutate: () => {
        queryClient.invalidateQueries([`/api/cart`])
      },
      onSuccess: () => {
        router.push('/cart')
      },
    },
  )

  const addOrderMutation = useMutation<
    unknown,
    unknown,
    Omit<OrdersDto.OrderItemResponse, 'id'>[],
    any
  >(
    (items) =>
      fetch(`/api/order`, {
        method: 'POST',
        body: JSON.stringify({ items }),
      }).then((res) => res.json()),
    {
      onMutate: () => {
        queryClient.invalidateQueries([`/api/order`])
      },
      onSuccess: () => {
        router.push('/mypage')
      },
    },
  )

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <Carousel
          animation="fade"
          autoplay
          withoutControls
          wrapAround
          speed={10}
          slideIndex={index}
        >
          <Image
            key={`Product-Detail=${product.id}`}
            src={product.image_url}
            className={styles.image}
            alt="image"
            width={620}
            height={780}
          />
        </Carousel>
        <div className={styles.infoContainer}>
          <span>{CATEGORY_MAP[product.category_id - 1]}</span>
          <div className={styles.name}>{product.name}</div>
          <p className={styles.price}>
            {(Math.ceil(product?.price / 100) * 100).toLocaleString()}원
          </p>
          <CountControl value={quantity} setValue={setQuantity} />
          <div className={styles.btnContainer}>
            <Button
              leftSection={<IconShoppingCart size={20} stroke={1.5} />}
              className={styles.btn}
              styles={{
                root: { paddingRight: 14, height: 48 },
              }}
              radius="xl"
              size="md"
              onClick={() => {
                if (session === null) {
                  alert('로그인이 필요합니다.')
                  return router.push('/auth/login')
                }
                addCartMutation.mutate({
                  productId: product.id,
                  quantity: Number(quantity),
                  amount: product.price * Number(quantity),
                })
              }}
            >
              장바구니
            </Button>
            <Button
              leftSection={
                isWished ? (
                  <IconHeart size={20} stroke={1.5} />
                ) : (
                  <IconHeartbeat size={20} stroke={1.5} />
                )
              }
              style={{
                backgroundColor: isWished ? 'red' : 'grey',
                width: '50%',
              }}
              styles={{
                root: { paddingRight: 14, height: 48 },
              }}
              radius="xl"
              size="md"
              onClick={() => {
                if (session === null) {
                  alert('로그인이 필요합니다.')
                  return router.push('/auth/login')
                }
                return mutation.mutate(String(product.id))
              }}
            >
              찜하기
            </Button>
          </div>
          <Button
            className={styles.buyBtn}
            styles={{
              root: { paddingRight: 14, height: 48 },
            }}
            radius="xl"
            size="md"
            onClick={() => {
              if (session === null) {
                alert('로그인이 필요합니다.')
                return router.push('/auth/login')
              }
              addOrderMutation.mutate([
                {
                  productId: product.id,
                  quantity: Number(quantity),
                  price: product.price,
                  amount: product.price * Number(quantity),
                },
              ])
            }}
          >
            구매하기
          </Button>
          <p className={styles.date}>등록: {formatTime(product.createdAt)}</p>
        </div>
      </div>
      <div className={styles.subImageContainer}>
        {[product.image_url].map((image, idx) => (
          <div key={idx} onClick={() => setIndex(idx)}>
            <Image src={image} alt="image" width={155} height={195} />
          </div>
        ))}
      </div>
      {editorState != null && (
        <CustomEditor editorState={editorState} readOnly />
      )}
      <div className={styles.bottom}>
        <p>후기</p>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className={styles.commentContainer} key={comment.id}>
              {/* {console.log('comment', comment)} */}
              <div className={styles.fContainer}>
                <div className={styles.rateContainer}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <IconStar
                      key={index}
                      fill={index < comment.rate ? 'red' : 'none'}
                      stroke={index < comment.rate ? 0 : 1}
                    />
                  ))}
                </div>
                <p>{formatTime(comment.updatedAt)}</p>
              </div>
              <CustomEditor
                editorState={EditorState.createWithContent(
                  convertFromRaw(JSON.parse(comment.contents)),
                )}
                readOnly
                noPadding
              />
              <div style={{ display: 'flex' }}>
                {comment?.images
                  ?.split(',')
                  .map((image, imageIndex) => (
                    <CustomImage src={image} key={imageIndex} size={150} />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <h2 className={styles.empty}>후기가 없습니다.</h2>
        )}
      </div>
    </div>
  )
}
