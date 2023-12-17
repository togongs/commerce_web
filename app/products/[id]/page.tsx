import React from 'react'
import Form from './Form'
import { ProductDto } from '@/app/types/products/products.dto'

export default async function Page({ params }: { params: { id: string } }) {
  const product: ProductDto.Response = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/products/${params.id}`,
  ).then((res) => res.json())
  return <Form product={product} />
}
