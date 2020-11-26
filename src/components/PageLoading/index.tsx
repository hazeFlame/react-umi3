import React from 'react'
import { View } from '@/components/hj-lib'
import { LoadingOutlined } from '@ant-design/icons'

const PageLoading = ({ text = 'loading', height = '100vh', spinning = true }) => (
  <View.Center height={height}>
    {spinning && <LoadingOutlined className='f48 t-primary' />}
    <span className={'m-t-10 t-gray f14'}>{text}...</span>
  </View.Center>
)

export default PageLoading
