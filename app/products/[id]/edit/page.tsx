import React from 'react'
import Edit from './Edit'
import getProductById from '@/app/api/products/route'
// import updateProduct from '@/app/api/products/updateProduct'

export default async function Page({ params }: any) {
  const product = await getProductById(Number(params?.id))
  console.log('get product??', product)
  return <Edit />
}
