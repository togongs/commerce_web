import React from 'react'
import Form from './Form'

const TAKE = 9
export default async function Page() {
  const products = await fetch(`http://localhost:3000/api/products`, {
    method: 'POST',
    body: JSON.stringify({
      skip: 0,
      take: Number(`${TAKE}`),
    }),
  }).then((res) => res.json())
  return <Form products={products} />
}
