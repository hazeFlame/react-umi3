import React from 'react'
import styled from 'styled-components'

const ClampTextContainer = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: ${props => Math.max(1, props.max || 1)};
  -webkit-box-orient: vertical;
  word-break: break-all;
  white-space: pre-wrap;
  overflow: hidden;
`

const ClampText = ({ max = 1, text = '', showTitle = true, className = '', children = null, ...rest }) => (
  <ClampTextContainer max={max} title={showTitle ? text || children : undefined} className={className} {...rest}>
    {children || text}
  </ClampTextContainer>
)

export default ClampText
