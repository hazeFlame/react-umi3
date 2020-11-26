import React, { FC, useEffect, useState } from 'react'
import { Modal, Steps } from 'antd'
import BasicInfo from './components/step1'
import InvoiceInfo from './components/step2'

import { get } from 'lodash'
import api from '@/conf/api'
import request from '@/utils/request'

const { MERCHANT_MANAGEMENT: { ENTERPRISE: { DETAIL } } } = api

const { Step } = Steps

interface IShopProps {
  onCancel: () => void
  setRefResh: () => void
  currentRecord: any
}

const ShopModal: FC<IShopProps> = ({ onCancel, currentRecord, setRefResh }) => {
  const [currentId, setCurrentId] = useState(get(currentRecord, 'id', null))
  const [currentEntity, setCurrentEntity] = useState(null)
  const [step, setStep] = useState<number>(0)

  const fetchEntity = (id: string) => {
    request.get(DETAIL.id(id).url).then(res => {
      setCurrentEntity(res.result)
    })
  }

  useEffect(() => {
    if (currentId) {
      fetchEntity(currentId)
    }
  }, [currentId])

  const steps = [
    {
      title: '基本资料',
      content: <BasicInfo currentId={currentId} onCancel={onCancel} setCurrentId={setCurrentId} setRefResh={setRefResh} setNextStep={() => setStep(1)} currentEntity={currentEntity} />,
    },
    {
      title: '开票信息',
      content: <InvoiceInfo onCancel={onCancel} currentEntity={currentEntity} setPrevStep={() => setStep(0)} />
    }
  ]

  const ContentSection = () => steps[step].content

  return (
    <Modal
      visible
      width={800}
      title="添加商户"
      footer={null}
      onCancel={onCancel}
    >
      <Steps current={step} size="small" className='p-x-100 p-b-10'>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <ContentSection />
    </Modal>
  )
}

export default ShopModal
