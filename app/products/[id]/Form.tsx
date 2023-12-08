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
    <>
      <div style={{ width: 1000, margin: '0 auto', padding: 36 }}>
        <div style={{ display: 'flex', gap: 40 }}>
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
              style={{ width: '100%', height: '100%' }}
              alt="image"
              width={600}
              height={600}
            />
          </Carousel>
          <div
            style={{
              minWidth: 180,
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
            }}
          >
            <p style={{ color: '#999' }}>
              {CATEGORY_MAP[product.category_id - 1]}
            </p>
            <div
              style={{
                fontWeight: 600,
                fontSize: 32,
              }}
            >
              {product.name}
            </div>
            <p style={{ color: '#333', fontWeight: 500 }}>
              {product.price.toLocaleString()}원
            </p>
            <Button
              style={{ backgroundColor: isWished ? 'red' : 'lightgray' }}
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
            <p style={{ color: '#999' }}>
              등록: {dayjs(product.createdAt).format('YYYY. MM. DD')}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 16 }}>
          {[product.image_url].map((image, idx) => (
            <div key={idx} onClick={() => setIndex(idx)}>
              <Image src={image} alt="image" width={100} height={100} />
            </div>
          ))}
        </div>
        {editorState != null && (
          <CustomEditor editorState={editorState} readOnly />
        )}
      </div>
    </>
  )
}
