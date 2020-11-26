import React from 'react'
import { SlideShow } from '@/components/hj-lib'
import { useDispatch, useSelector } from 'dva'

const GlobalUI = () => {
  const mediasPreview = useSelector((state: any) => state.ui.mediasPreview)
  const dispatch = useDispatch()
  return (
    <>
      <SlideShow
        canDownload
        sidebar={mediasPreview.items.length > 1}
        visible={mediasPreview.show}
        medias={mediasPreview.items}
        current={mediasPreview.current}
        onClose={() => dispatch({ type: 'ui/HIDE_MEDIA_PREVIEW' })}
      />
    </>
  )
}

export default GlobalUI
