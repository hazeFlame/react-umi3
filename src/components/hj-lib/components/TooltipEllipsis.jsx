import React from 'react'
import { Tooltip } from 'antd'
import { getShort } from '@/utils/utils'
import styled from 'styled-components'
const S = styled.span`
  white-space:nowrap;
`

const TooltipEllipsis = ({ str, max, opts, empty = '暂无数据', direction, showSize }) => {
  if (!str) return <span>{empty}</span>
  if (str.replace(/[\u0391-\uFFE5]/g, 'aa').length <= max) return <span>{str}</span>
  return (
    <Tooltip title={str}>
      <S >{getShort(str || '', max, opts, direction, showSize)}</S>
    </Tooltip>
  )
}

export default TooltipEllipsis
