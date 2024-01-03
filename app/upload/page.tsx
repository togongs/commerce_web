'use client'

import React from 'react'
import styles from './page.module.scss'
import Button from '@/components/Button'
import Image from 'next/image'
import CustomImage from '@/components/CustomImage'

export default function Page() {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [image, setImage] = React.useState('')
  const handleUpload = () => {
    if (inputRef.current && inputRef.current.files) {
      const formData = new FormData()
      formData.append(
        'image',
        inputRef.current.files[0],
        inputRef.current.files[0].name,
      )

      fetch(
        `https://api.imgbb.com/1/upload?key=1407a9b6273b99fe06163c8c4d7e4513&expiration=1407a9b6273b99fe06163c8c4d7e4513`,
        {
          method: 'POST',
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => setImage(data.data.url))
    }
  }
  return (
    <div className={styles.container}>
      <input ref={inputRef} type="file" accept="image/*" />
      <Button onClick={handleUpload}>업로드</Button>
      {image !== '' && <CustomImage src={image} />}
    </div>
  )
}
