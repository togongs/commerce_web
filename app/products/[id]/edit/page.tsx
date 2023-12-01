import React from 'react'
import Edit from './Edit'

export default async function Page() {
  const product = await fetch(`http://localhost:3000/api/products`).then(
    (res) => res.json(),
  )
  console.log('product', product)
  return <Edit />
}
