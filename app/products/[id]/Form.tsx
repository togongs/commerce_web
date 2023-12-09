'use client'

import React from 'react'
import { ProductDto } from '@/app/types/products/products.dto'
import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw } from 'draft-js'
import Image from 'next/image'
import Carousel from 'nuka-carousel'
import dayjs from 'dayjs'
import { CATEGORY_MAP } from '@/constants/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './Form.module.scss'
import { IconHeart, IconHeartbeat } from '@tabler/icons-react'

interface FormProps {
  product: ProductDto.Response
}

export default function Form({ product }: FormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [index, setIndex] = React.useState(0)
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
  //   console.log('wishlist', wishlist)
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
          <p className={styles.price}>{product.price.toLocaleString()}원</p>
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
          <p className={styles.date}>
            등록: {dayjs(product.createdAt).format('YYYY. MM. DD')}
          </p>
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
    </div>
  )
}
