'use client'

import React, { useCallback } from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import { ProductDto } from '../types/products/products.dto'
import { Pagination } from '@mantine/core'

const TAKE = 9
export default function Page() {
  const [activePage, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  console.log('total', total)
  const [products, setProducts] = React.useState<ProductDto.Response[]>([])
  const categories = '1'
  React.useEffect(() => {
    fetch(`/api/products/count`)
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data / TAKE)))
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

  return (
    <Container>
      <Grid>
        {products?.map((item: any) => (
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
            <NameBox>
              {
                {
                  1: '의류',
                }[categories]
              }
            </NameBox>
          </ImageContainer>
        ))}
      </Grid>
      <Pagination
        style={{ display: 'flex', justifyContent: 'center' }}
        value={activePage}
        onChange={setPage}
        total={total}
      />
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
const NameBox = styled.span`
  color: gray;
`
