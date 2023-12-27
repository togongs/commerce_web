'use client'

import CustomEditor from '@/components/Editor'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export default function Page() {
  const searchParams = useSearchParams()
  const orderItemId = searchParams?.get('orderItemId')
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  )

  const handleSave = () => {
    if (editorState && orderItemId != null) {
      fetch(`/api/comment`, {
        method: 'POST',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
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
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])
  return (
    <div>
      {/* {editorState != null && ( */}
      <CustomEditor
        editorState={editorState as any}
        onEditorStateChange={setEditorState}
        onSave={handleSave}
      />
      {/* )} */}
    </div>
  )
}
