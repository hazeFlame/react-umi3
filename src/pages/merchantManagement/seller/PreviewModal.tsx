import React from 'react'
import { Button, Modal, Tabs, Descriptions } from 'antd'

import api from '@/conf/api'
import Credentials from '@/components/Credentials'
import useFetch from '@/utils/useFetch'

const { TabPane } = Tabs
const { Item } = Descriptions

const { MERCHANT_MANAGEMENT: { ENTERPRISE: { DETAIL } } } = api

const PreviewModal = ({ onCancel, currentRecord, previewType }: any) => {
  const { data: { result } } = useFetch({ initialUrl: DETAIL.id(currentRecord.id).url, detail: true })
  
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
      </div>
      <div className='t-center m-t-20'>
        <Button onClick={onCancel} className="m-r-15" type="primary">
          关闭
        </Button>
      </div>
    </Modal>
  )
}

export default PreviewModal
