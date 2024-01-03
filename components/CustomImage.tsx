import React from 'react'
import styles from './CustomImage.module.scss'
import Image from 'next/image'

export default function CustomImage({
  src,
  size = 500,
}: {
  src: string
  size?: number
}) {
  const containerStyle: any = {
    width: `${size}px`,
    height: `${size}px`,
  }
  return (
    <div className={styles.imageContainer} style={size && containerStyle}>
      <Image src={src} alt="image" layout="fill" objectFit="contain" />
    </div>
  )
}
