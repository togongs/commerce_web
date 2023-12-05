import Image from 'next/image'
import React from 'react'
import Form from './Form'
import { ProductDto } from './types/products/products.dto'

export default async function Home() {
  const products: ProductDto.Response[] = await fetch(
    `http://localhost:3000/api/products`,
  ).then((res) => res.json())

  return <Form products={products} />
}
