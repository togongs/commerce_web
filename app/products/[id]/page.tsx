import React from 'react'
import Form from './Form'

export default async function Page({ params }: { params: { id: string } }) {
  const [product, comments] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/products/${params.id}`).then(
      (res) => res.json(),
    ),
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/comments/${params.id}`).then(
      (res) => res.json(),
    ),
  ])
  return <Form product={product} comments={comments} />
}
