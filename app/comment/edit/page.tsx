'use client'

import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.scss'
import React, { useState } from 'react'
import { Slider } from '@mantine/core'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderItemId = searchParams?.get('orderItemId')
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  )
  const [rate, setRate] = useState(5)

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
          images: [],
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert('저장되었습니다.')
          router.back()
        })
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
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])
  return (
    <div className={styles.container}>
      {/* {editorState != null && ( */}
      <CustomEditor
        editorState={editorState as any}
        onEditorStateChange={setEditorState}
        onSave={handleSave}
      />
      {/* )} */}
      <Slider
        defaultValue={5}
        mih={1}
        max={5}
        step={1}
        value={rate}
        onChange={setRate}
        marks={[
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ]}
      />
    </div>
  )
}
