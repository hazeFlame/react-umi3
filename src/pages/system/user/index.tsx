import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Checkbox, Form, Input, Modal, Popconfirm } from 'antd'
import { TooltipEllipsis } from '@/components/hj-lib'
import CustomTable from '@/components/CustomTable'

import request from '@/utils/request'
import useFetch from '@/utils/useFetch'
import hasAuth from '@/utils/hasAuth'
import api from '@/conf/api'
import { get } from 'lodash'

const { SYSTEM: { USER: { LIST, ADD, EDIT, DELETE }, ROLE: { LIST: lists } } } = api

const User = ({ location }: any) => {
  const [refresh, setRefResh] = useState(1)
  const [state, setState] = useState<any>({
    roleModalVisible: false,
    currentRole: null,
    isCreate: false,
    isNew: true
  })

  const { loading, data: { result: { list, total } } } = useFetch({ initialUrl: LIST.url, params: { ...location.query, refresh } })

  const handleDelete = (id: any) => {
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
      title: '登录手机号',
      dataIndex: 'mobile',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      hideInSearch: true
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginDate',
      render: (t: any) => <TooltipEllipsis str={t} max={26} />,
      hideInSearch: true
    },
    {
      title: '所属角色',
      dataIndex: 'roles',
      render: (t: any[]) => <TooltipEllipsis str={t.map((v: { roleName: string }) => v.roleName).join(', ')} max={26} />,
      hideInSearch: true
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      render: (t: string) => t === "0" ? '启用' : '停用',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (text: any, record: { id: string }) => (
        <div>
          {hasAuth('system:user:edit') && <span className='btn-basic t-edit' onClick={() => setState({ ...state, roleModalVisible: true, isNew: false, currentRole: record })}>编辑</span>}
          <Popconfirm
            title="确定删除嘛?"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            {hasAuth('system:user:delete') && <span className='btn-basic t-remove m-l-10'>删除</span>}
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <PageContainer
      extra={<Button type='primary' onClick={() => setState({ ...state, roleModalVisible: true, isNew: true })}>新增用户</Button>}
    >
      <CustomTable loading={loading} columns={columns} dataSource={list} total={total} />
      {state.roleModalVisible && <RoleModal isNew={state.isNew} setRefResh={setRefResh} refresh={refresh} currentRole={state.currentRole} onCancel={() => setState({ ...state, roleModalVisible: false, currentRole: null })} />}
    </PageContainer>
  )
}

const RoleModal = ({ onCancel, currentRole, isNew, setRefResh, refresh }: any) => {
  const [loading, setLoading] = useState(false)

  const { data: { result: { list } } } = useFetch({ initialUrl: lists.url, detail: true })

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      let resp
      if (isNew) {
        resp = await request.post(ADD.url, {
          data: {
            ...values,
          }
        })
      } else {
        resp = await request.put(EDIT.url, {
          data: {
            ...currentRole,
            ...values,
          }
        })
      }
      if (!resp.code) {
        onCancel()
        setRefResh(refresh + 1)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible
      title={isNew ? '新建用户' : '编辑用户'}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        initialValues={{
          ...currentRole,
          roles: get(currentRole, 'roles', []).map((v: { id: string }) => v.id)
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name='mobile'
          label="登录手机号"
          labelCol={{ span: 5 }}
          rules={[
            { message: '请输入角色名称', required: true },
          ]}
        >
          <Input placeholder="请输入11位手机号码" />
        </Form.Item>
        <Form.Item
          name='realName'
          label="姓名"
          labelCol={{ span: 5 }}
          rules={[
            { message: '请输入姓名', required: true },
          ]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name='remark'
          label='备注'
          labelCol={{ span: 5 }}
        >
          <Input maxLength={20} placeholder="补充说明，限20个字" />
        </Form.Item>
        <Form.Item
          name='roles'
          label='所属角色'
          labelCol={{ span: 5 }}
        >
          <Checkbox.Group>
            {list.map((v: { id: string, roleName: string }) => (
              <Checkbox value={v.id} key={v.id} style={{ lineHeight: '32px' }}>
                {v.roleName}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
        <div className='t-center m-t-20'>
          <Button type='primary' htmlType='submit' loading={loading}>提交</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default User
