import React, { useState } from 'react'
import { Button, DatePicker, Popconfirm } from 'antd'
import { PageContainer } from '@ant-design/pro-layout'
import CustomTable from '@/components/CustomTable'

import { history } from "umi"
import useFetch from '@/utils/useFetch'
import api from '@/conf/api'
import moment from 'moment'
import { isNumber, mapValues, omitBy, pickBy, trim } from 'lodash'
import hasAuth from '@/utils/hasAuth'
import request from '@/utils/request'
import { goodAuditStatus, managementType } from '@/enums'

const { RangePicker } = DatePicker

const { COMMODITY_MANAGEMENT: { AUDITGOOD: { LIST, DELETE } } } = api

const AuditGood = ({ location }: any) => {
  const [refresh, setRefResh] = useState<number>(1)

  const { loading, data: { result: { list, total } } } = useFetch({ initialUrl: LIST.url, params: { ...location.query, refresh } })

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
      title: '商品查询',
      dataIndex: 'goodsName',
      hideInTable: true,
      initialValue: location.query.goodsName
    },
    {
      title: '商户类型',
      hideInTable: true,
      dataIndex: 'managementType',
      initialValue: location.query.managementType,
      valueEnum: omitBy(managementType, isNumber)
    },
    {
      title: '提交时间',
      hideInSearch: true,
      dataIndex: 'createDate',
    },
    {
      title: '商品ID',
      hideInSearch: true,
      dataIndex: 'id',
    },
    {
      title: '商品名称',
      hideInSearch: true,
      dataIndex: 'goodsTitle',
    },
    {
      title: '价格',
      hideInSearch: true,
      dataIndex: 'unitPrice',
      valueType: 'money'
    },
    {
      title: '计价单位',
      hideInSearch: true,
      dataIndex: 'goodsName',
    },
    {
      title: '一级分类',
      hideInSearch: true,
      dataIndex: 'oneCategories',
    },
    {
      title: '二级分类',
      hideInSearch: true,
      dataIndex: 'twoCategories',
    },
    {
      title: '三级分类',
      hideInSearch: true,
      dataIndex: 'threeCategories',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      initialValue: location.query.managementType,
      valueEnum: omitBy(goodAuditStatus, isNumber)
    },
    {
      title: '创建日期',
      dataIndex: 'authDate',
      hideInTable: true,
      initialValue: location.query.authBeginDate ? [
        moment(location.query.authBeginDate),
        moment(location.query.authEndDate)
      ] : null,
      renderFormItem: (_: any, { type, defaultRender, ...rest }: any) => {
        return <RangePicker {...rest} />;
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
    <PageContainer>
      <CustomTable
        loading={loading}
        columns={columns}
        dataSource={list}
        total={total}
        searchNode={
          (form: { getFieldsValue: () => any; getFieldValue: (arg0: string) => any[] }) => (
            <Button
              key="search"
              type="primary"
              onClick={() => {
                const searchQuery = {
                  ...form?.getFieldsValue(),
                  authBeginDate: form?.getFieldValue('authDate') && moment(form?.getFieldValue('authDate')[0]).format('YYYY-MM-DD'),
                  authEndDate: form?.getFieldValue('authDate') && moment(form?.getFieldValue('authDate')[1]).format('YYYY-MM-DD')
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
    </PageContainer>
  )
}

export default AuditGood
