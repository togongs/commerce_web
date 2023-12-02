'use client'

import React from 'react'
import Image from 'next/image'
import { styled } from 'styled-components'

export default function Form({ products }: any) {
  return (
    <div style={{ padding: 36 }}>
      <Grid>
        {products?.map((item: any) => (
          <div key={item.id}>
            {item.name}
            <Image
              src={item.image_url ?? ''}
              width={300}
              height={200}
              alt="image"
            />
          </div>
        ))}
      </Grid>
    </div>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
`
