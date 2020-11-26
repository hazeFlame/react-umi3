/** eslint-disable */
import React, { ReactElement, ReactChildren, ReactHTMLElement, SFC, CSSProperties, ReactNode } from 'react'

type Align = 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'space-between' | 'space-around'

interface IBaseProps {
  className?: string | string[] | { [key: string]: boolean };
  style?: CSSProperties;
  children?: JSX.Element[] | JSX.Element;
  onClick?: (...args: any) => any
}

interface IViewProps extends IBaseProps {
  flex?: number | string
  align?: Align
  justify?: Align
  row?: boolean
  column?: boolean
  wrap?: boolean
  radius?: number | string
  height?: number | string
  background?: string
  color?: string
  width?: number | string
}

interface IClampTextProps extends IBaseProps {
  max?: number
  showTitle?: boolean
  text?: string
}

declare module "./index" {
  export const View: SFC<IViewProps>
  export const ClampText: SFC<IClampTextProps>
  export const TooltipEllipsis
  export const UploadProgressContainer
  export const UploadFile
  export const SlideShow
}
