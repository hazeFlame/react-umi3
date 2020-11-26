import React from 'react'
import { useDispatch, useSelector } from 'dva'
import { Upload, Progress } from 'antd'
import Icon from '@ant-design/icons'
import { UploadListType } from 'antd/lib/upload/interface'
import { View } from '@/components/hj-lib'
import styled from 'styled-components'

const UplodList = styled.div`
  &.fixed {
    position: fixed;
    top: 10px;
    background: #fff;
    left: 50%;
    transform: translate(-50%);
    padding: 10px 20px 20px 10px;
    border-radius: 4px;
    z-index: 999;
    box-shadow: 0 0 3px #ddd;
    min-width: 300px;
    .ant-upload-list-item {
      margin-bottom: 15px;
    }
    .i-trash {
      margin-top: 10px;
    }
  }
  .ant-progress-status-success .ant-progress-bg {
    background-color: #1890ff;
    height: 4px !important;
    border-radius: 2px !important;
  }
  .ant-upload-list-item-info {
    overflow: hidden;
  }
  .ant-upload-list-item-name {
    //width: 90%;
  }
`

function customRequest({ dispatch, onSuccess, onProgress, params, uploadType }, { file }) {
  dispatch({
    type: 'upload/upload',
    file: file.file,
    params,
    uploadType,
    done: (name, path) => {
      dispatch({ type: 'upload/DONE', payload: { name, path } })
      if (onSuccess) {
        onSuccess(name, path)
      }
    },
    progress: (name, percent, speed) => {
      dispatch({ type: 'upload/PROGRESS', payload: { name, percent, speed } })
      if (onProgress) {
        onProgress({ name, percent, speed })
      }
    }
  })
}

const cancelUpload = (dispatch, upID) => {
  dispatch({
    type: 'upload/cancel',
    payload: { upID }
  })
}

const checkFile = file => true

const UploadItem = ({ id, file, percent, speed, onRemove }) => (
  <div className="ant-upload-list-item ant-upload-list-item-uploading">
    <View row>
      <View flex={1} className="ant-upload-list-item-info">
        <Icon type={'loading'} spin={percent < 100} />
        <span className="ant-upload-list-item-name" title={file.name}>
          {speed} {file.name}
        </span>
      </View>
      <Icon
        type={'delete'}
        className={'t-danger'}
        title="Remove file"
        onClick={() => onRemove(id)}
      />
    </View>
    <div className="ant-upload-list-item-progress">
      <Progress
        percent={percent}
        showInfo={false}
        size={'small'}
        status={'success'}
        className={'antd-list-item-progress'}
      />
    </div>
  </div>
)


const UploadFile = ({
  children,
  dragger = false,
  multiple = false,
  showUploadList = false,
  listType = 'text',
  accept = undefined,
  description = '点击或拖动上传',
  beforeUpload,
  onSuccess,
  className = '',
  fixed = false,
  uploadType,
  params
}) => {
  const upload = useSelector(state => state.upload)
  const dispatch = useDispatch()

  const UploadComponent = dragger ? Upload.Dragger : Upload
  const inner = dragger ? (
    <>
      <p className="t-primary f48">
        <Icon type="inbox" />
      </p>
      <p className="f14 m-b-10">{description}</p>
    </>
  ) : null
  return (
    <View className={className}>
      <UploadComponent
        customRequest={file => customRequest({ dispatch, onSuccess, params, uploadType }, { file })}
        multiple={multiple}
        accept={accept}
        listType={listType || UploadListType}
        showUploadList={false}
        beforeUpload={beforeUpload || checkFile}
      >
        {children || inner}
      </UploadComponent>
      {showUploadList && !!upload.ids.length && (
        <UplodList className={'ant-upload-list ant-upload-list-text' + (fixed ? ' fixed' : '')}>
          {upload.ids.map(id => {
            const f = upload.entities[id]
            return (
              <UploadItem
                key={id}
                id={id}
                percent={f.percent}
                speed={f.speed}
                file={f.file}
                onRemove={upID => (dispatch, upID)}
              />
            )
          })}
        </UplodList>
      )}
    </View>
  )
}

export default UploadFile