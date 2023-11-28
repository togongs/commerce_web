import React from 'react'

// interface FormData {
//   id: number
//   name: string
//   image_url: string
//   category_id: number
// }

export default function Form({ products }: any) {
  return (
    <div>
      <p>product list</p>
      <div>
        {products?.map((item: any) => <div key={item.id}>{item.name}</div>)}
      </div>
    </div>
  )
}
