'use client'

import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Carousel from 'nuka-carousel'
import React, { useState } from 'react'

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
]

export default function Edit() {
  const [index, setIndex] = React.useState(0)
  const params = useParams()
  const productId = params?.id
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  )

  const handleSave = () => {
    if (editorState && productId != null) {
      fetch(`/api/products`, {
        method: 'POST',
        body: JSON.stringify({
          id: Number(productId),
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          ),
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert('success')
        })
    }
  }

  React.useEffect(() => {
    if (productId != null) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.contents)),
              ),
            )
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [productId])

  return (
    <>
      <Carousel
        animation="fade"
        autoplay
        withoutControls
        wrapAround
        speed={10}
        slideIndex={index}
      >
        {images.map((item) => (
          <Image
            key={item.original}
            src={item.original}
            alt="image"
            width={1000}
            height={600}
            layout="responsive"
          />
        ))}
      </Carousel>
      <div style={{ display: 'flex' }}>
        {images.map((item, idx) => (
          <div key={idx} onClick={() => setIndex(idx)}>
            <Image src={item.original} alt="image" width={100} height={60} />
          </div>
        ))}
      </div>
      {editorState != null && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
    </>
  )
}
