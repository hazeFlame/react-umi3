import React from 'react'
import { Row, Col, Tag, Form } from 'antd'
import styled from 'styled-components'
import showMediaPreview from '@/utils/showMediaPreview'
import { keyBy, findIndex } from 'lodash'
import { PlusOutlined } from '@ant-design/icons'
import { IMAGE_MIME_TYPES } from '@/utils/upload'

import { UploadProgressContainer, UploadFile } from '@/components/hj-lib'
import { useSelector } from 'dva'

/**
 *
 * @param {Object:{label:标题,valueImg:接口返回的url,defaultImage:默认显示图片,name:接口标示,hiddenBtn:隐藏上传}} list    Form props
 * @param {object}  colProps  col props
 * @param {string} uploadUrl   上传url
 * @param {Object} rowProps   row props
 *
 */

const Wrap = styled.div`
  .ant-upload {
    width:100%
  }
`

const ImgView = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  border: 1px dashed #ccc;
  overflow: hidden;
  vertical-align:middle;
  text-align:center;
`
const Mask = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(0,0,0,.3);
`

const H6 = styled.h6`
  &::before {
    display: inline-block;
    margin-right: 4px;
    color: #f50;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
`

const Credentials = ({ uploadType, list, children, colProps, rowProps, onSuccess, btnStyle = {} }: any) => {
  const upload = useSelector((state: any) => state.upload)

  const getUrl = (item: { hiddenBtn: any; valueImg: any; defaultImage: any; name: React.ReactText }) => {
    if (item.hiddenBtn) {
      return item.valueImg || item.defaultImage
    }
    if (upload.entities[item.name]) {
      if (upload.entities[item.name].path || upload.entities[item.name].success) {
        return upload.entities[item.name].path
      }
    } else {
      return item.valueImg
    }
  }

  const medias = Object.values({ ...keyBy(list, 'name'), ...upload.entities }).map((v: any) => ({ type: 'picture', name: v.name, path: v.valueImg || v.path || v.defaultImage || '' })).filter(v => v.path)
  return (
    <Wrap>
      <Row gutter={24} {...rowProps}>
        {
          list.map((item: { name: string; valueImg: any; required: any; requiredMessage?: string; label: React.ReactNode; defaultImage: string; hiddenBtn: boolean }, index: string | number | null | undefined) => {
            return (
              <Col span={6} {...colProps} key={index}>
                <Form.Item
                  name={item.name}
                  rules={[
                    { required: item.required, message: item.requiredMessage }
                  ]}
                >
                  {item.required ?
                    <H6 className="f14">{item.label}</H6> :
                    <h6 className="f14">{item.label}</h6>
                  }
                  <ImgView>
                    {!getUrl(item) && !item.hiddenBtn ?
                      <UploadFile
                        accept={IMAGE_MIME_TYPES}
                        className='w-max'
                        params={{ name: item.name }}
                        uploadType={uploadType}
                        onSuccess={(name: any, path: any) => onSuccess && onSuccess(name, path)}
                      >
                        <div style={{ height: '200px', width: '100%', background: `url(${item.defaultImage}) top center no-repeat`, backgroundSize: 'cover' }}>
                          <Mask className='pointer'>
                            <PlusOutlined className='t-white' style={{ fontSize: '80px', lineHeight: '200px' }} />
                          </Mask>
                        </div>
                      </UploadFile> :
                      <img
                        style={{ height: '200px', width: '100%', verticalAlign: 'middle' }}
                        src={getUrl(item)}
                        onClick={() => showMediaPreview(medias, findIndex(medias, { 'name': item.name }))} // uniqBy(medias, 'path')
                      />
                    }
                  </ImgView>
                  <UploadProgressContainer upload={upload} name={item.name} />
                </Form.Item>
                {!item.hiddenBtn ? <div className='m-t-20 t-center' style={btnStyle}>
                  <UploadFile
                    params={{ name: item.name }}
                    uploadType={uploadType}
                    accept={IMAGE_MIME_TYPES}
                    onSuccess={(name: any, path: any) => onSuccess && onSuccess(name, path)}
                  >
                    {children || <Tag color="#2db7f5" className='pointer'>上传</Tag>}
                  </UploadFile>
                </div> : null}
              </Col>
            )
          })
        }
      </Row>
    </Wrap>
  )
}

export default Credentials
