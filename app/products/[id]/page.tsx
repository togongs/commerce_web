import React from 'react'
import Form from './Form'
import { ProductDto } from '@/app/types/products/products.dto'

export default async function Page({ params }: { params: { id: string } }) {
  const product: ProductDto.Response = await fetch(
    `http://localhost:3000/api/products/${params.id}`,
  )
    .then((res) => res.json())
    .then((data) => data)
  return <Form product={product} />
}
