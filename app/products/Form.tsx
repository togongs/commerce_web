'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import { ProductDto } from '../types/products/products.dto'
import { Pagination } from '@mantine/core'
import { TAKE } from '@/constants/products'

export default function Form() {
  //   const [skip, setSkip] = React.useState(0)
  const [activePage, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [products, setProducts] = React.useState<ProductDto.Response[]>([])
  const categories = '1'
  React.useEffect(() => {
    fetch(`/api/products/count`)
      .then((res) => res.json())
      .then((data) => setTotal(data))
    fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        skip: 0,
        take: Number(`${TAKE}`),
      }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])
  React.useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        skip: skip,
        take: Number(`${TAKE}`),
      }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [activePage])
  //   const getProducts = useCallback(() => {
  //     const next = skip + TAKE
  //     fetch(`/api/products`, {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         skip: next,
  //         take: Number(`${TAKE}`),
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const list = [...products, ...data]
  //         setProducts(list)
  //       })
  //     setSkip(next)
  //   }, [products, skip])

  return (
    <Container>
      <Grid>
        {products?.map((item) => (
          <ImageContainer key={item.id}>
            <Image
              style={{ borderRadius: 12 }}
              src={item.image_url ?? ''}
              width={300}
              height={200}
              alt="image"
            />
            <p>{item.name}</p>
            <p>{item.price.toLocaleString()}원</p>
            <CategoryName>
              {
                {
                  1: '의류',
                }[categories]
              }
            </CategoryName>
          </ImageContainer>
        ))}
      </Grid>
      {/* <button
        onClick={getProducts}
        style={{
          width: '100%',
          borderRadius: 6,
          backgroundColor: '#e6e6e6',
          height: 46,
        }}
      >
        더보기
      </button> */}
      <Pagination value={activePage} onChange={setPage} total={total} />
    </Container>
  )
}
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`
const ImageContainer = styled.div`
  margin-bottom: 24px;
`
const CategoryName = styled.span`
  color: gray;
`
