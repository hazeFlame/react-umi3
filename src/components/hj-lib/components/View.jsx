import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  align-items: stretch;
  justify-content: flex-start;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  font: inherit;
  text-align: inherit;
  text-decoration: none;
  list-style: none;
  pointer-events: auto;
`

const View = ({
  className = '',
  children,
  align,
  justify,
  column = false,
  wrap = false,
  row = false,
  radius,
  height,
  background,
  color,
  flex,
  width,
  style,
  ...rest
}) => {
  let customStyle = {}

  if (row) {
    customStyle.flexDirection = 'row'
  }

  if (column) {
    customStyle.flexDirection = 'column'
  }

  if (customStyle.flexDirection && customStyle.flexDirection === 'row') {
    customStyle.alignItems = 'flex-start'
  }

  if (align) {
    customStyle.alignItems = align
  }

  if (justify) {
    customStyle.justifyContent = justify
  }

  if (wrap) {
    customStyle.flexWrap = 'wrap'
  }

  if (flex) {
    customStyle.flex = flex
  }

  if (width !== undefined) {
    customStyle.width = width
  }

  if (height !== undefined) {
    customStyle.height = height
  }

  if (background) {
    customStyle.background = background
  }
  if (color !== undefined) {
    customStyle.color = color
  }
  if (radius) {
    customStyle.borderRadius = radius
  }

  if (style) {
    customStyle = { ...customStyle, ...style }
  }

  return (
    <Container className={className} style={Object.keys(customStyle) ? customStyle : null} {...rest}>
      {children}
    </Container>
  )
}
View.displayName = 'View'

View.Center = styled(View)`
  align-items: center !important;
  justify-content: center !important;
`
View.Center.displayName = 'View.Center'

export default View
