'use client'

import React from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'
import { ProductDto } from '../types/products/products.dto'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, TAKE } from '@/constants/products'
import { CategoryDto } from '../types/category/category.dto'
import useDebounce from '@/hooks/useDebounce'
import NotFoundPage from './not-found'

export default function Page() {
  const [activePage, setPage] = React.useState<number>(1)
  const [total, setTotal] = React.useState<number>(0)
  const [categories, setCategories] = React.useState<CategoryDto.Response[]>([])
  const [products, setProducts] = React.useState<ProductDto.Response[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string>('-1')
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    FILTERS[0].value,
  )
  const [keyword, setKeyword] = React.useState('')
  const debouncedKeyword = useDebounce<string>(keyword)

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
        keyword: debouncedKeyword,
      }),
    })
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data / TAKE)))
  }, [debouncedKeyword, selectedCategory])

  React.useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetch(`/api/products`, {
      method: 'POST',
      body: JSON.stringify({
        skip: skip,
        take: Number(`${TAKE}`),
        category: Number(selectedCategory),
        orderBy: selectedFilter,
        keyword: debouncedKeyword,
      }),
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [activePage, debouncedKeyword, selectedCategory, selectedFilter])
  console.log('products', products)
  return (
    <Container>
      <Input
        style={{ marginBottom: 16 }}
        placeholder="Search"
        value={keyword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value)
        }}
      />
      <FilterContainer>
        {categories && (
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
        )}
        <Select
          data={FILTERS}
          value={selectedFilter}
          onChange={setSelectedFilter}
        />
      </FilterContainer>
      {products.length > 0 ? (
        <Grid>
          {products?.map((item) => (
            <div key={item.id}>
              <Image
                style={{ borderRadius: 12 }}
                src={item.image_url ?? ''}
                width={265}
                height={331}
                alt="image"
              />
              <p>{item.name}</p>
              <p>{item.price.toLocaleString()}원</p>
              <NameBox>{CATEGORY_MAP[item.category_id - 1]}</NameBox>
            </div>
          ))}
        </Grid>
      ) : (
        <NotFoundPage />
      )}
      <Pagination
        style={{ display: 'flex', justifyContent: 'center', marginTop: 25 }}
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
const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`
const NameBox = styled.span`
  color: gray;
`
