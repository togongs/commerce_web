import Image from 'next/image'
import React from 'react'
import Form from './Form'

// interface FormData {
//   id: number
//   name: string
//   image_url: string
//   category_id: number
// }

export default async function Home() {
  const products = await fetch(`http://localhost:3000/api/products`).then(
    (res) => res.json(),
  )

  return <Form products={products} />
}
