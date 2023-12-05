import React from 'react'
import { ProductDto } from './types/products/products.dto'

interface FormData {
  products: ProductDto.Response[]
}

export default function Form({ products }: FormData) {
  return (
    <div>
      <p>product list</p>
      <div>{products?.map((item) => <div key={item.id}>{item.name}</div>)}</div>
    </div>
  )
}
