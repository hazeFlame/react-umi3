import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Popconfirm, DatePicker } from 'antd'
import CustomTable from '@/components/CustomTable'
import ShopModal from './ShopModal'
import PreviewModal from './PreviewModal'

import request from '@/utils/request'
import useFetch from '@/utils/useFetch'
import hasAuth from '@/utils/hasAuth'
import api from '@/conf/api'
import { history } from "umi"
import { useDispatch } from 'dva'
import { isEmpty, isNumber, mapValues, omitBy, pickBy, trim } from 'lodash'
import moment from 'moment'
import { managementType, b } from '@/enums'

const { RangePicker } = DatePicker
const { MERCHANT_MANAGEMENT: { SELLER: { LIST }, ENTERPRISE: { DELETE } } } = api

type preview = 'view' | 'audit'

const Enterprise = ({ location }: any) => {
  const [refresh, setRefResh] = useState<number>(1)
  const [currentModalVisible, setCurrentModalVisible] = useState<boolean>(false)
  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [previewType, setPreviewType] = useState<preview>('view')

  const { loading, data: { result: { list, total } } } = useFetch({ initialUrl: LIST.url, params: { ...location.query, refresh } })
  const dispatch = useDispatch()

  const handleDelete = (id: string) => {
    request.delete(DELETE.id(id).url).then(res => {
      if (!res.code) {
        setRefResh(refresh + 1)
      }
    })
  }

  const columns = [
    {
      title: '排序',
      key: 'sort',
      render: (t: any, r: any, i: any) => i + 1,
      hideInSearch: true
    },
    {
      title: '类型',
      hideInSearch: true,
      dataIndex: 'managementType',
      initialValue: location.query.managementType,
      valueEnum: omitBy(managementType, isNumber)
    },
    {
      title: '公司名称',
      dataIndex: 'officeName',
      initialValue: location.query.officeName
    },
    {
      title: '联系人名称',
      dataIndex: 'contactName',
      initialValue: location.query.contactName
    },
    {
      title: '联系电话',
      dataIndex: 'contactMobile',
      initialValue: location.query.contactMobile
    },
    {
      title: '创建日期',
      dataIndex: 'authDate',
      initialValue: location.query.authBeginDate ? [
        moment(location.query.authBeginDate),
        moment(location.query.authEndDate)
      ] : null,
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return <RangePicker {...rest} />;
      }
    },
    {
      title: '类型',
      hideInTable: true,
      dataIndex: 'managementType',
      initialValue: location.query.managementType,
      valueEnum: omitBy(managementType, isNumber)
    },
    {
      title: '账户状态',
      dataIndex: 'auditStatus',
      initialValue: location.query.auditStatus,
      valueEnum: omitBy(b, isNumber)
    },
    {
      title: '开票信息',
      hideInSearch: true,
      dataIndex: 'contactMobile',
      render: (t: any, r: { invoiceVO: any }) => {
        if (isEmpty(r.invoiceVO)) return '待完善'
        return '已完善'
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      align: 'center',
      fixed: 'right',
      render: (text: any, record: { id: string }) => (
        <div onClick={(e) => { e.stopPropagation() }}>
          {hasAuth('system:user:edit') && <span className='btn-basic t-edit m-x-10' onClick={(e) => { e.stopPropagation(), setCurrentModalVisible(true), setCurrentRecord(record) }}>编辑</span>}
          <Popconfirm
            title="确定删除嘛?"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            {hasAuth('system:user:delete') && <span className='btn-basic t-remove m-r-10' onClick={(e) => e.stopPropagation()}>删除</span>}
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <PageContainer
      extra={<Button type='primary' onClick={() => setCurrentModalVisible(true)}>新增用户</Button>}
    >
      <CustomTable
        loading={loading}
        columns={columns}
        dataSource={list}
        total={total}
        onRow={(record: any) => {
          return {
            onClick: () => {
              setPreviewModalVisible(true)
              setCurrentRecord(record)
              setPreviewType('view')
            }
          }
        }}
        searchNode={
          (form: { getFieldsValue: () => any; getFieldValue: (arg0: string) => any[] }) => (
            <Button
              key="search"
              type="primary"
              onClick={() => {
                const searchQuery = {
                  ...form?.getFieldsValue(),
                  authBeginDate: form?.getFieldValue('authDate') && moment(form?.getFieldValue('authDate')[0]).format('YYYY-MM-DD'),
                  authEndDate: form?.getFieldValue('authDate') && moment(form?.getFieldValue('authDate')[1]).format('YYYY-MM-DD'),
                }
                delete searchQuery.authDate
                history.push({
                  pathname: location.pathname,
                  query: {
                    page: 1,
                    ...mapValues(pickBy(searchQuery, (v: any) => !!v), (v: any) => trim(v)),
                  }
                })
              }}
            >
              查询
            </Button>
          )
        }
      />
      {currentModalVisible &&
        <ShopModal
          onCancel={() => { setCurrentModalVisible(false), setCurrentRecord(null), dispatch({ type: 'upload/CLEAR' }) }}
          currentRecord={currentRecord}
          setRefResh={() => setRefResh(refresh + 1)}
        />
      }
      {previewModalVisible &&
        <PreviewModal
          onCancel={() => { setPreviewModalVisible(false), setCurrentRecord(null) }}
          currentRecord={currentRecord}
          setRefResh={() => setRefResh(refresh + 1)}
          previewType={previewType}
        />
      }
    </PageContainer>
  )
}

export default Enterprise
