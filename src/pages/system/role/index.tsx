import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Checkbox, Collapse, Form, Input, InputNumber, Modal, Popconfirm, Skeleton } from 'antd'
import { TooltipEllipsis, View } from '@/components/hj-lib'

import styled from 'styled-components'
import request from '@/utils/request'
import useFetch from '@/utils/useFetch'
import hasAuth from '@/utils/hasAuth'
import api from '@/conf/api'
import { difference, get, intersection, union, uniq } from 'lodash'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import CustomTable from '@/components/CustomTable'
const { Panel } = Collapse

const { SYSTEM: { ROLE: { LIST, ADD, EDIT, DELETE }, FUNCTION: { LIST: lists } } } = api

const CheckboxWrap = styled(Checkbox)`
  margin-left: 0px !important;
`

const CollapseWrap = styled(Collapse)`
.ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}
.ant-collapse-content {
  border-top: none;
}
.ant-collapse-content-box >div {
  padding: 0 16px 0 40px;
}
.ant-collapse-content-box >div:first-child {
  padding-top: 16px;
  border-top: 1px solid #d9d9d9;
}
.ant-collapse-content-box >div:last-child {
  padding-bottom: 16px;
}
`

const Role = ({ location }: any) => {
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
      dataIndex: 'sort',
      hideInSearch: true
    },
    {
      title: '名称',
      dataIndex: 'roleName',
      initialValue: location.query.roleName
    },
    {
      title: '包含的用户',
      dataIndex: 'users',
      render: (t: any[]) => <TooltipEllipsis str={t.map(v => v.realName).join(', ')} max={26} />,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      hideInSearch: true
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (t: any) => <TooltipEllipsis str={t} max={26} />,
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
          {hasAuth('system:role:edit') && <span className='btn-basic t-edit' onClick={() => setState({ ...state, roleModalVisible: true, isNew: false, currentRole: record })}>编辑</span>}
          <Popconfirm
            title="确定删除嘛?"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            {hasAuth('system:role:delete') && <span className='btn-basic t-remove m-l-10'>删除</span>}
          </Popconfirm>
        </div>
      )
    }
  ]

  return (
    <PageContainer
      extra={<Button type='primary' onClick={() => setState({ ...state, roleModalVisible: true, isNew: true })}>新增角色</Button>}
    >
      <CustomTable loading={loading} columns={columns} dataSource={list} total={total} />
      {state.roleModalVisible && <RoleModal isNew={state.isNew} setRefResh={setRefResh} refresh={refresh} currentRole={state.currentRole} onCancel={() => setState({ ...state, roleModalVisible: false, currentRole: null })} />}
    </PageContainer>
  )
}

const RoleModal = ({ onCancel, currentRole, isNew, setRefResh, refresh }: any) => {
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    checkedKeys: get(currentRole, 'functions', []).map((v: { id: string }) => v.id)
  })
  const { loading: spinning, data: { result: { list } } } = useFetch({ initialUrl: lists.url, detail: true })

  const handleChangeModule = (e: CheckboxChangeEvent, c: { id: any }, currentModuleId: unknown, authIds: any[], currentModuleChildren: any[], currentModules: any[]) => {
    const currentModuleAuthIds = currentModuleChildren.map(v => v.id)
    const currentModuleIds = currentModules.map(v => v.id)
    if (e.target.checked) {
      setState({ ...state, checkedKeys: union(currentModuleAuthIds, uniq([...state.checkedKeys, c.id, currentModuleId])) })
    } else {
      if (intersection(state.checkedKeys, currentModuleIds).length === 1) {
        setState({ ...state, checkedKeys: difference(state.checkedKeys.filter((v: any) => v !== c.id), currentModuleAuthIds).filter(f => f !== currentModuleId) })
      } else {
        setState({ ...state, checkedKeys: difference(state.checkedKeys.filter((v: any) => v !== c.id), currentModuleAuthIds) })
      }
    }
  }
  const handleChangeAuth = (e: { target: { checked: any } }, currentAuth: { id: any }, currentModuleId: React.ReactText, moduleId: any) => {
    if (e.target.checked) {
      setState({ ...state, checkedKeys: uniq([...state.checkedKeys, currentAuth.id, currentModuleId, moduleId]) })
    } else {
      setState({ ...state, checkedKeys: state.checkedKeys.filter((v: any) => v !== currentAuth.id) })
    }
  }

  const genExtra = (a: any, authIds: any[]) => {
    const getChecked = () => {
      if (authIds.length) {
        return !difference(authIds, state.checkedKeys).length
      } else {
        return state.checkedKeys?.includes(a[0])
      }
    }
    return (
      <div onClick={e => e.stopPropagation()}>
        <Checkbox
          onChange={event => {
            if (event.target.checked) {
              setState({ ...state, checkedKeys: union(a, state.checkedKeys) })
            } else {
              setState({ ...state, checkedKeys: [...difference(state.checkedKeys, a)] })
            }
          }}
          checked={getChecked()}
        >
          全选
        </Checkbox>
      </div>
    )
  }

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      let resp
      if (isNew) {
        resp = await request.post(ADD.url, {
          data: {
            ...values,
            functions: state.checkedKeys
          }
        })
      } else {
        resp = await request.put(EDIT.url, {
          data: {
            ...currentRole,
            ...values,
            functions: state.checkedKeys
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
      title={isNew ? '新建角色' : '编辑角色'}
      onCancel={onCancel}
      width={700}
      footer={null}
    >
      <Form
        initialValues={currentRole}
        onFinish={handleSubmit}
      >
        <Form.Item
          name='roleName'
          label="角色名称"
          labelCol={{ span: 3 }}
          rules={[
            { message: '请输入角色名称', required: true },
          ]}
        >
          <Input placeholder="请输入要添加角色名称" />
        </Form.Item>
        <Form.Item
          name='remark'
          label='备注'
          labelCol={{ span: 3 }}
        >
          <Input maxLength={20} placeholder="补充说明，限20个字" />
        </Form.Item>
        <Form.Item
          name='sort'
          label="排序"
          labelCol={{ span: 3 }}
          rules={[
            { message: '请排序', required: true },
          ]}
        >
          <InputNumber
            placeholder='请排序'
            min={1}
            precision={0}
            parser={(value: any) => value.replace(/[^\d]/g, '')}
          />
        </Form.Item>
        {!isNew && <Skeleton loading={spinning} active title={false} paragraph={{ rows: 6 }}>
          <CollapseWrap accordion>
            {list.map((v: { id: React.ReactText; children: any[]; functionName: React.ReactNode }, index: any) => {
              const a = [v.id]
              const moduleIds = []
              const authIds: any[] = []
              get(v, 'children', []).forEach(zz => {
                a.push(zz.id)
                moduleIds.push(zz.id)
                authIds.push(zz.id)
                if (zz.children) {
                  zz.children.forEach((dd: { id: React.ReactText }) => {
                    a.push(dd.id)
                    authIds.push(dd.id)
                  })
                }
              })
              return <Panel
                key={v.id}
                extra={genExtra(a, authIds)}
                header={<span>{v.functionName}</span>}>
                {v.children && v.children.map(c => {
                  return (
                    <View row key={c.id}>
                      <View row flex='none' className='m-r-20'>
                        <Checkbox value={c.id} checked={state.checkedKeys?.includes(c.id)} onChange={e => handleChangeModule(e, c, v.id, authIds, c.children, v.children)}>
                          {c.functionName}
                        </Checkbox>
                      </View>
                      <div>
                        {c.children.map((d: { id: any; functionName?: any }) =>
                          <CheckboxWrap key={d.id} checked={state.checkedKeys.includes(d.id)} value={d.id} onChange={(e: { target: { checked: any } }) => handleChangeAuth(e, d, v.id, c.id)}>
                            {d.functionName}
                          </CheckboxWrap>
                        )}
                      </div>
                    </View>
                  )
                })}
              </Panel>
            })}
          </CollapseWrap>
        </Skeleton>}
        <div className='t-center m-t-20'>
          <Button type='primary' htmlType='submit' loading={loading}>提交</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default Role
