import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: relative;
  > div {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
  }
`
const EllipsisText = ({ children, className = '', textClassName = '', textStyle = {}, width = 0, height = 0, flex = 1, ...rest }) => {
  const style = { flex }
  if (width) style.width = width
  if (height) style.height = height
  return (
    <Wrap className={className} style={{ ...style }} {...rest}>
      <div style={{ ...textStyle }} className={textClassName}>{children}</div>
    </Wrap>
  )
}
EllipsisText.displayName = 'EllipsisText'
export default EllipsisText
