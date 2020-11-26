import React, { FC, useState } from 'react'
import { Button, Col, Form, Input, Row } from 'antd'

import { PATTERN } from '@/constants'
import request from '@/utils/request'
import api from '@/conf/api'
import { get } from 'lodash'

const { MERCHANT_MANAGEMENT: { INVOICE: { ADD, EDIT } } } = api

interface IInvoiceProps {
  currentEntity: any,
  setPrevStep: () => void
  onCancel: () => void
}

const InvoiceInfo: FC<IInvoiceProps> = ({ currentEntity, setPrevStep, onCancel }) => {
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then(values => {
      setSaveLoading(true)
      request(currentEntity.invoiceVO ? EDIT.url : ADD.url, {
        method: currentEntity.invoiceVO ? 'PUT' : 'POST',
        data: {
          ...values,
          id: get(currentEntity, 'id', undefined)
        }
      }).then(res => {
        if (!res.code) {
          setSaveLoading(false)
          onCancel()
        }
      })
    })
  }

  return (
    <Form
      initialValues={currentEntity.invoiceVO}
      onFinish={handleSubmit}
      form={form}
    >
      <Row gutter={24} className='m-t-30'>
        <Col span={12}>
          <Form.Item
            label="发票抬头"
            name="invoiceTitle"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入发票抬头' }
            ]}
          >
            <Input placeholder="请输入发票抬头" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="注册地址"
            name="registeredAddress"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入注册地址' }
            ]}
          >
            <Input placeholder="请输入注册地址" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="税号"
            name="dutyParagraph"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入税号' }
            ]}
          >
            <Input placeholder="请输入税号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="注册电话"
            name="registerTelephone"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入注册电话' },
              { message: '请输入正确手机号!', pattern: PATTERN.mobile }
            ]}
          >
            <Input placeholder="请输入注册电话" maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="开户行别"
            name="depositBank"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入开户行别' }
            ]}
          >
            <Input placeholder="例：中国银行" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="开户行"
            name="bankOfDeposit"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入开户行' }
            ]}
          >
            <Input placeholder="例：中国银行太原晋阳街支行" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="开户账号"
            name="accountNumber"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入开户账号' }
            ]}
          >
            <Input placeholder="请输入开户账号" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="发票收件人"
            name="invoiceRecipient"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入发票收件人' }
            ]}
          >
            <Input placeholder="请输入发票收件人" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="收件人电话"
            name="recipientTelephone"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入收件人电话' },
              { message: '请输入正确手机号!', pattern: PATTERN.mobile }
            ]}
          >
            <Input placeholder="请输入收件人电话" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="发票收件地址"
            name="invoiceReceivingAddress"
            labelCol={{ span: 7 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入发票收件地址' }
            ]}
          >
            <Input placeholder="请输入发票收件地址" />
          </Form.Item>
        </Col>
      </Row>
      <div className='t-center m-t-20'>
        <Button onClick={setPrevStep} type="primary">
          上一步
        </Button>
        <Button onClick={handleSubmit} className="m-l-15" type="primary" loading={saveLoading}>
          保存提交
        </Button>
      </div>
    </Form>
  )
}

export default InvoiceInfo
