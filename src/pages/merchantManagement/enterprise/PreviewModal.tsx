import React, { useState } from 'react'
import { Button, Modal, Tabs, Descriptions, Radio, Input } from 'antd'

import request from '@/utils/request'
import api from '@/conf/api'
import Credentials from '@/components/Credentials'
import useFetch from '@/utils/useFetch'

const { TextArea } = Input
const { TabPane } = Tabs
const { Item } = Descriptions

const { MERCHANT_MANAGEMENT: { ENTERPRISE: { AUDIT, DETAIL } } } = api

const PreviewModal = ({ onCancel, currentRecord, setRefResh, previewType }: any) => {
  const [auditStatus, setAuditStatus] = useState(currentRecord.auditStatus || '1')
  const [remark, setRemark] = useState(currentRecord.remark || '')

  const { data: { result } } = useFetch({ initialUrl: DETAIL.id(currentRecord.id).url, detail: true })


  const handleSubmit = () => {
    request.put(AUDIT.url, {
      data: {
        ...currentRecord,
        auditStatus,
        remark
      }
    })
    onCancel()
    setRefResh()
  }

  return (
    <Modal
      visible
      onCancel={onCancel}
      title={previewType === 'view' ? '查看' : '审核'}
      width={800}
      footer={null}
    >
      <div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="基本信息" key="1">
            <Descriptions title="基础信息" column={2}>
              <Item label="公司名称">{result.officeName}</Item>
              <Item label="公司简称">{result.officeAliasName}</Item>
              <Item label="公司地址">{`${result.officeProvinceAddress}${result.officeCityAddress}${result.officePrefectureAddress}${result.officeDetailedAddress}`}</Item>
              <Item label="公司联系方式">{result.officeTelephone}</Item>
            </Descriptions>
            <Descriptions title="联系人信息" column={2}>
              <Item label="联系人姓名">{result.contactName}</Item>
              <Item label="联系电话">{result.contactMobile}</Item>
            </Descriptions>
            <Descriptions title="资质证书">
              <Item>
                <Credentials
                  list={
                    [
                      {
                        label: '营业执照',
                        name: 'businessLicenseFileId',
                        defaultImage: '',
                        valueImg: result && result.businessLicenseFileId,
                        hiddenBtn: true
                      },
                      {
                        label: '开户许可证',
                        name: 'industryLicenseFileId',
                        defaultImage: '',
                        valueImg: result && result.industryLicenseFileId,
                        hiddenBtn: true
                      },
                      {
                        label: '授权书',
                        name: 'writtenAuthorizationFileId',
                        defaultImage: '',
                        valueImg: result && result.writtenAuthorizationFileId,
                        hiddenBtn: true
                      }
                    ]
                  }
                  height={180}
                  colProps={{ 'span': 8 }}
                />
              </Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="开票信息" key="2">
            <Descriptions title="开票信息" column={2}>
              <Item label="发票抬头">{result?.invoiceVO?.invoiceTitle}</Item>
              <Item label="注册地址">{result?.invoiceVO?.registeredAddress}</Item>
              <Item label="税号">{result?.invoiceVO?.dutyParagraph}</Item>
              <Item label="注册电话">{result?.invoiceVO?.registerTelephone}</Item>
              <Item label="开户行别">{result?.invoiceVO?.depositBank}</Item>
              <Item label="开户行">{result?.invoiceVO?.bankOfDeposit}</Item>
              <Item label="开户账号">{result?.invoiceVO?.accountNumber}</Item>
              <Item label="发票收件人">{result?.invoiceVO?.invoiceRecipient}</Item>
              <Item label="收件人电话">{result?.invoiceVO?.recipientTelephone}</Item>
              <Item label="发票收件地址">{result?.invoiceVO?.invoiceReceivingAddress}</Item>
            </Descriptions>
          </TabPane>
        </Tabs>
        {previewType === 'audit' && <Descriptions title="审核结果" column={1}>
          <Item>
            <Radio.Group onChange={e => setAuditStatus(e.target.value)} value={auditStatus}>
              <Radio value={'1'}>通过</Radio>
              <Radio value={'0'}>不通过</Radio>
            </Radio.Group>
          </Item>
          {auditStatus === '0' && <Item>
            <TextArea rows={4} value={remark} onChange={e => setRemark(e.target.value)} placeholder="请输入不通过原因"/>
          </Item>}
        </Descriptions>}
      </div>
      <div className='t-center m-t-20'>
        {
          previewType === 'view' ?
            <Button onClick={onCancel} className="m-r-15" type="primary">
              关闭
            </Button>
            :
            <>
              <Button onClick={onCancel} className="m-r-15" type="primary">
                取消
              </Button>
              <Button onClick={() => handleSubmit()} type="primary">
                确认审核
              </Button>
            </>
        }
      </div>
    </Modal>
  )
}

export default PreviewModal
