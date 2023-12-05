'use client'

import React from 'react'
import { styled } from 'styled-components'

export default function NotFoundPage() {
  return (
    <>
      <Title>검색결과를 찾을 수 없습니다.</Title>
      <Description>
        다른 이름으로 검색하거나
        <br /> 검색어를 잘못 입력했는지 확인해보세요.
      </Description>
    </>
  )
}

const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  color: #333;
  font-weight: 400;
  margin-bottom: 20px;
  padding-top: 20px;
`
const Description = styled.p`
  font-size: 16px;
  color: #999;
  text-align: center;
  line-height: 1.5;
`
