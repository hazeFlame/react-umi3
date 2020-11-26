
import React from 'react'

import { Tooltip, Progress } from 'antd'
import styled from 'styled-components'
import { DeleteOutlined } from '@ant-design/icons'
import { View } from '@/components/hj-lib'

const ProgressContainer = styled(View)`
  width: 100%;
  .ant-progress-success-bg,
  .ant-progress-bg {
    background-color: #5a3;
  }
  .anticon-close {
    margin-left: 10px;
    color: #5a3;
  }
`

const UploadProgressContainer = ({ upload, logo }) => {
  if (!upload.entities[logo] || (upload.entities[logo].success)) return null
  return (
    <React.Fragment>
      <ProgressContainer row align='center'>
        <Tooltip title={upload.entities[logo].name}>
          <Progress strokeWidth={6} percent={upload.entities[logo] && upload.entities[logo].percent} />
        </Tooltip>
        <DeleteOutlined className='m-l-10' onClick={upload.entities[logo].cancel} />
      </ProgressContainer>
    </React.Fragment>
  )
}

export default UploadProgressContainer
