'use client'

import React from 'react'
import styles from './page.module.scss'

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundContainer}>
      <h2>검색결과를 찾을 수 없습니다.</h2>
      <p>
        다른 이름으로 검색하거나
        <br /> 검색어를 잘못 입력했는지 확인해보세요.
      </p>
    </div>
  )
}
