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
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const [activePage, setPage] = React.useState<number>(1)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('-1')
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    FILTERS[0].value,
  )
  const [keyword, setKeyword] = React.useState('')
  const debouncedKeyword = useDebounce<string>(keyword)

  const { data: categories } = useQuery<any, any, CategoryDto.Response[]>(
    [`categories`],
    () => fetch(`/api/categories`).then((res) => res.json()),
  )

  const { data: total } = useQuery(
    [
      `${selectedCategory}
      ${debouncedKeyword}`,
    ],
    () =>
      fetch(`/api/products/count`, {
        method: 'POST',
        body: JSON.stringify({
          category: Number(selectedCategory),
          keyword: debouncedKeyword,
        }),
      })
        .then((res) => res.json())
        .then((data) => Math.ceil(data / TAKE)),
  )

  const { data: products } = useQuery<any, any, ProductDto.Response[]>(
    [
      `${TAKE}
      ${activePage}
      ${selectedFilter}
      ${selectedCategory}
      ${debouncedKeyword}`,
    ],
    () =>
      fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify({
          skip: TAKE * (activePage - 1),
          take: Number(`${TAKE}`),
          category: Number(selectedCategory),
          orderBy: selectedFilter,
          keyword: debouncedKeyword,
        }),
      }).then((res) => res.json()),
  )
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
      {products && products.length > 0 ? (
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
        total={total ?? 0}
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
  color: #999;
`
