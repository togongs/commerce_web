'use client'

import React from 'react'
import Image from 'next/image'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, TAKE } from '@/constants/products'
import useDebounce from '@/hooks/useDebounce'
import NotFoundPage from './not-found'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CategoryDto } from './types/category/category.dto'
import { ProductDto } from './types/products/products.dto'
import styles from './page.module.scss'
import { IconSearch } from '@tabler/icons-react'

export default function Home() {
  const router = useRouter()
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
    <div className={styles.container}>
      <Input
        leftSection={<IconSearch />}
        className={styles.input}
        placeholder="Search"
        value={keyword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setKeyword(e.target.value)
        }}
      />
      <div className={styles.tabContainer}>
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
      </div>
      {products && products.length > 0 ? (
        <div className={styles.imageContainer}>
          {products?.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/products/${item.id}`)}
            >
              <Image
                className={styles.image}
                src={item.image_url ?? ''}
                width={265}
                height={331}
                alt="image"
              />
              <p>{item.name}</p>
              <p>{(Math.ceil(item.price / 100) * 100).toLocaleString()}원</p>
              <span>{CATEGORY_MAP[item.category_id - 1]}</span>
            </div>
          ))}
        </div>
      ) : (
        <NotFoundPage />
      )}
      <Pagination
        className={styles.pagination}
        value={activePage}
        onChange={setPage}
        total={total ?? 0}
      />
    </div>
  )
}
