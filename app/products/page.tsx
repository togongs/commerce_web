'use client'

import React from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import { ProductDto } from '../types/products/products.dto'
import { Pagination, SegmentedControl } from '@mantine/core'
import { CATEGORY_MAP, TAKE } from '@/constants/products'
import { CategoryDto } from '../types/category/category.dto'

export default function Page() {
  const [activePage, setPage] = React.useState<number>(1)
  const [total, setTotal] = React.useState<number>(0)
  const [categories, setCategories] = React.useState<CategoryDto.Response[]>([])
  const [products, setProducts] = React.useState<ProductDto.Response[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string>('-1')

  React.useEffect(() => {
    fetch(`/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [selectedCategory])

  React.useEffect(() => {
    fetch(`/api/products/count`, {
      method: 'POST',
      body: JSON.stringify({
        category: Number(selectedCategory),
      }),
    })
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data / TAKE)))
  }, [selectedCategory])

  React.useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        skip: skip,
        take: Number(`${TAKE}`),
        category: Number(selectedCategory),
      }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [activePage, selectedCategory])
  return (
    <Container>
      {categories && (
        <div>
          <SegmentedControl
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { label: 'ALL', value: '-1' },
              ...categories.map((category) => ({
                label: category.name,
                value: String(category.id),
              })),
            ]}
            color="dark"
          />
        </div>
      )}
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
            <NameBox>{CATEGORY_MAP[item.category_id - 1]}</NameBox>
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
