'use client'

import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.scss'
import Image from 'next/image'
import React from 'react'
import { Slider } from '@mantine/core'
import CustomImage from '@/components/CustomImage'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderItemId = searchParams?.get('orderItemId')
  const [editorState, setEditorState] = React.useState<EditorState | undefined>(
    undefined,
  )
  const [rate, setRate] = React.useState(5)
  const [images, setImages] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (editorState && orderItemId != null) {
      fetch(`/api/comment/update`, {
        method: 'POST',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
          rate: rate,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          ),
          images: images.join(','),
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert('저장되었습니다.')
          router.back()
        })
    }
  }

  const handleChange = () => {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      for (let i = 0; i < inputRef.current.files.length; i++) {
        const formData = new FormData()
        formData.append(
          'image',
          inputRef.current.files[i],
          inputRef.current.files[i].name,
        )

        fetch(
          `https://api.imgbb.com/1/upload?key=1407a9b6273b99fe06163c8c4d7e4513&expiration=1407a9b6273b99fe06163c8c4d7e4513`,
          {
            method: 'POST',
            body: formData,
          },
        )
          .then((res) => res.json())
          .then((data) => {
            setImages((prev) => Array.from(new Set(prev.concat(data.data.url))))
          })
      }
    }
  }

  React.useEffect(() => {
    if (orderItemId != null) {
      fetch(`/api/comment/${orderItemId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data?.contents)),
              ),
            )
            setRate(data.rate)
            setImages(data.images.split(',') ?? [])
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])

  return (
    <div className={styles.container}>
      <p className={styles.title}>후기를 작성해주세요.</p>
      <div style={{ width: 500 }}>
        {/* {editorState != null && ( */}
        <CustomEditor
          editorState={editorState as any}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
        {/* )} */}
        <Slider
          className={styles.slider}
          defaultValue={5}
          mih={1}
          max={5}
          step={1}
          value={rate}
          onChange={setRate}
          marks={[
            { value: 0, label: '0점' },
            { value: 1, label: '1점' },
            { value: 2, label: '2점' },
            { value: 3, label: '3점' },
            { value: 4, label: '4점' },
            { value: 5, label: '5점' },
          ]}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
        />
        <div style={{ display: 'flex' }}>
          {images &&
            images.length > 0 &&
            images.map((image, imageIndex) => (
              <CustomImage src={image} key={imageIndex} />
            ))}
        </div>
      </div>
    </div>
  )
}
