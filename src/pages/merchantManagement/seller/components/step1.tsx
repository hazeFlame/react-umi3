import React, { FC, useState } from 'react'
import { Button, Col, Form, Input, Radio, Row } from 'antd'

import styled from 'styled-components'
import CustomCascader from '@/components/CustomCascader'
import { PATTERN } from '@/constants'
import Credentials from '@/components/Credentials'

import request from '@/utils/request'
import api from '@/conf/api'
import { managementType, uploadTypeEnum } from '@/enums'
import { CascaderOptionType } from 'antd/lib/cascader'
import { isNumber, omitBy } from 'lodash'

const { MERCHANT_MANAGEMENT: { SELLER: { ADD }, ENTERPRISE: { EDIT } } } = api

const Title = styled.h5`
  font-size: 14px;
  font-weight: bold;
  margin: 10px 0;
`

interface IBasicProps {
  currentId: string | null | any
  currentEntity: any
  setNextStep: () => void
  onCancel: () => void
  setRefResh: () => void
  setCurrentId: (v: string) => void
}

const BasicInfo: FC<IBasicProps> = ({ currentId, currentEntity, setNextStep, onCancel, setRefResh, setCurrentId }) => {
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [nextLoading, setNextLoading] = useState<boolean>(false)

  const handleSubmit = (type: string) => {
    form.validateFields().then(values => {
      if (type === 'save') {
        setSaveLoading(true)
      } else {
        setNextLoading(true)
      }
      request(currentId ? EDIT.url : ADD.url, {
        method: currentId ? 'PUT' : 'POST',
        data: {
          ...values,
          officeProvinceAddress: values.officeAddress[0].areaName,
          officeCityAddress: values.officeAddress[1].areaName,
          officePrefectureAddress: values.officeAddress[2].areaName,
          officeProvinceCode: values.officeAddress[0].id,
          officeCityCode: values.officeAddress[1].id,
          officePrefectureCode: values.officeAddress[2].id,
          id: currentId
        }
      }).then(res => {
        setSaveLoading(false)
        setNextLoading(false)
        if (!res.code) {
          setRefResh()
          if (type === 'save') {
            onCancel()
          } else {
            if (!currentId) {
              setCurrentId(res.result)
            }
            setNextStep()
          }
        }
      })
    })
  }

  const handleSetAddress = (values: CascaderOptionType[] | undefined) => {
    form.setFieldsValue({ officeAddress: values })
  }

  const addressCode = currentEntity ? [currentEntity.officeProvinceCode, currentEntity.officeCityCode, currentEntity.officePrefectureCode] : []
  return (
    <Form
      initialValues={{
        ...currentEntity,
        officeAddress: currentEntity ? [
          { id: currentEntity.officeProvinceCode, areaName: currentEntity.officeProvinceAddress },
          { id: currentEntity.officeCityCode, areaName: currentEntity.officeCityAddress },
          { id: currentEntity.officePrefectureCode, areaName: currentEntity.officePrefectureAddress }
        ] : undefined
      }}
      form={form}
    >
      <Title>
        基础信息
      </Title>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label="类型"
            name="managementType"
            labelCol={{ span: 4 }}
            labelAlign='left'
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Radio.Group>
              {Object.keys(omitBy(managementType, isNumber)).map(v => (
                <Radio value={v} key={v}>{omitBy(managementType, isNumber)[v]}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="公司名称"
            name="officeName"
            labelCol={{ span: 4 }}
            labelAlign='left'
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司名称" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="公司简称"
            name="officeAliasName"
            labelAlign='left'
            labelCol={{ span: 4 }}
            rules={[{ required: true, message: '请输入公司简称' }]}
          >
            <Input placeholder="请输入公司简称" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="公司地址"
            name="officeAddress"
            labelCol={{ span: 4 }}
            labelAlign='left'
            rules={[{ required: true, message: '请选择公司地址' }]}
          >
            <CustomCascader areaValues={addressCode} setAddress={handleSetAddress} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="详细地址"
            labelCol={{ span: 4 }}
            labelAlign='left'
            name="officeDetailedAddress"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="公司联系方式"
            name="officeTelephone"
            labelCol={{ span: 4 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入公司固话' },
              { message: '请输入正确手机号!', pattern: PATTERN.mobile }
            ]}
          >
            <Input placeholder="请输入公司固话" maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="联系人姓名"
            name="contactName"
            labelCol={{ span: 4 }}
            labelAlign='left'
            rules={[
              { required: true, message: '请输入联系人姓名' }
            ]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="联系电话"
            labelCol={{ span: 4 }}
            labelAlign='left'
            name="contactMobile"
            rules={[
              { required: true, message: '请输入手机号' },
              { message: '请输入正确手机号!', pattern: PATTERN.mobile }
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="服务费收取"
            labelCol={{ span: 4 }}
            labelAlign='left'
            name="isCharge"
            rules={[
              { required: true, message: '请输入手机号' },
            ]}
          >
            <Radio.Group>
              <Radio value={'0'}>不收取</Radio>
              <Radio value={'1'}>按固定比例</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.isCharge !== currentValues.isCharge}
          >
            {({ getFieldValue }) => {
              return getFieldValue('isCharge') === '1' ? (
                <Form.Item name="serviceCharge" label=" " labelCol={{ span: 4 }} rules={[{ required: true, message: '请输入比例值' }]}>
                  <Input placeholder='请输入固定比例' suffix={'％'} />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>
      <Title>
        资质证书（授权书联系人需与当前联系人一致）
      </Title>
      <Credentials
        list={
          [
            {
              label: '营业执照',
              name: 'businessLicenseFileId',
              defaultImage: '',
              valueImg: currentEntity && currentEntity.businessLicenseFileId
            },
            {
              label: '开户许可证',
              name: 'industryLicenseFileId',
              defaultImage: '',
              valueImg: currentEntity && currentEntity.industryLicenseFileId
            },
            {
              label: '授权书',
              name: 'writtenAuthorizationFileId',
              defaultImage: '',
              valueImg: currentEntity && currentEntity.writtenAuthorizationFileId
            }
          ]
        }
        height={180}
        onSuccess={(name: any, path: any) => {
          form.setFieldsValue({ [name]: path })
        }}
        uploadType={uploadTypeEnum['good']}
        colProps={{ 'span': 8 }}
      />
      <div className='t-center m-t-20'>
        <Button onClick={() => handleSubmit('save')} className="m-r-15" type="primary" loading={saveLoading}>
          保存
        </Button>
        {<Button onClick={() => handleSubmit('next')} type="primary" loading={nextLoading}>
          下一步
        </Button>}
      </div>
    </Form>
  )
}

export default BasicInfo 
