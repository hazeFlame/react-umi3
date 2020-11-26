import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Table } from 'antd'
import { IconFont } from '@/components/IconFont'

import request from '@/utils/request'
import useFetch from '@/utils/useFetch'
import hasAuth from '@/utils/hasAuth'
import api from '@/conf/api'


const { SYSTEM: { FUNCTION: { LIST, ADD, EDIT, DELETE } } } = api

const FUNCTION_TYPE = {
  '0': '公用权限',
  '1': '运营权限',
  '2': '托运权限',
}

const Authority = () => {
  const [refresh, setRefResh] = useState(1)
  const [state, setState] = useState<any>({
    currentRow: null,
    authModalVisible: false,
    expandedRowKeys: [],
    isNew: false
  })

  const { loading, data: { result: { list } } } = useFetch({ initialUrl: LIST.url, detail: true, params: { refresh } })

  const handleDelete = (id: any) => {
    request.delete(DELETE.id(id).url).then(res => {
      if (!res.code) {
        setRefResh(refresh + 1)
      }
    })
  }

  const columns = [
    {
      title: '操作',
      align: 'center',
      width: 200,
      render: (_: any, record: { id: any }) => {
        return (
          <div>
            {hasAuth('system:function:edit') && <span className='btn-basic t-edit m-r-10' onClick={() => setState({ ...state, authModalVisible: true, isNew: false, currentRow: record })}>编辑</span>}
            <Popconfirm
              title="确定删除嘛?"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
              icon={<IconFont type='iconicon' />}
            >
              {hasAuth('system:function:delete') && <span className='btn-basic t-remove'>删除</span>}
            </Popconfirm>
          </div>
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort'
    },
    {
      title: '权限',
      dataIndex: 'functionName'
    },
    {
      title: '权限标识',
      dataIndex: 'permission'
    },
    {
      title: '请求地址',
      dataIndex: 'url'
    },
    {
      title: 'icon',
      dataIndex: 'icon'
    },
    {
      title: '权限区分',
      dataIndex: 'functionType',
      render: (t: string | number) => <span>{FUNCTION_TYPE[t]}</span>
    },
    {
      title: '权限类型',
      dataIndex: 'type',
      render: (t: any) => {
        switch (t) {
          case 'menu':
            return '菜单'
          case 'button':
            return '按钮'
          default:
            return ''
        }
      }
    }
  ]
  const rootSubmenuKeys = list.map((v: { id: string }) => v.id)

  return (
    <PageContainer
      extra={<Button type='primary' onClick={() => setState({ ...state, authModalVisible: true, isNew: true })}>新增权限</Button>}
    >
      <Table
        columns={columns}
        loading={loading}
        className={'m-t-10'}
        scroll={{ x: 1500 }}
        rowSelection={{
          type: 'checkbox',
          onSelect: record => {
            if (state.currentRow && state.currentRow.id === record.id) {
              setState({ ...state, currentRow: null })
            } else {
              setState({ ...state, currentRow: record })
            }
          },
          columnTitle: ' ',
          getCheckboxProps: (r: any) => ({
            disabled: r.type === 'button' ? true : false
          }),
          selectedRowKeys: state.currentRow ? [state.currentRow.id] : []
        }}
        pagination={{ pageSize: 300 }}
        expandable={{
          expandedRowKeys: state.expandedRowKeys,
          onExpandedRowsChange: r => {
            const latestOpenKey = r.find(key => state.expandedRowKeys.indexOf(key) === -1)
            if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
              setState({ ...state, expandedRowKeys: r })
            } else {
              setState({
                ...state,
                expandedRowKeys: latestOpenKey ? [latestOpenKey] : []
              })
            }
          }
        }}
        dataSource={list}
        rowKey={'id'}
      />
      {state.authModalVisible &&
        <AuthModal
          currentRow={state.currentRow}
          isNew={state.isNew}
          onCancel={() => setState({ ...state, authModalVisible: false })}
          setRefResh={setRefResh}
          refresh={refresh}
        />
      }
    </PageContainer>
  )
}
const AuthModal = ({ isNew, currentRow, onCancel, refresh, setRefResh }: any) => {
  const [loading, setLoading] = useState(false)
  const onFinish = async (v: any) => {
    setLoading(true)
    if (isNew) {
      try {
        if (currentRow) {
          await request.post(ADD.url, { data: { ...v, parentId: currentRow.id } })
          setRefResh(refresh + 1)
        } else {
          await request.post(ADD.url, { data: { ...v, parentId: 0 } })
          setRefResh(refresh + 1)
        }
      } catch (err) {
        throw err
      }
    } else {
      await request.put(EDIT.url, { data: { ...v, id: currentRow.id } })
      setRefResh(refresh + 1)
    }
    setLoading(false)
    onCancel()
  }

  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      visible
      title={isNew ? '新增权限' : '编辑权限'}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        onFinish={onFinish}
        initialValues={isNew ? {} : currentRow}
      >
        <Form.Item
          label='权限名称'
          name='functionName'
          labelCol={{ span: 5 }}
          rules={[
            { required: true, message: '请输入权限名称' }
          ]}
        >
          <Input autoComplete="on" allowClear placeholder='请输入权限名称' />
        </Form.Item>
        <Form.Item
          label='请求地址'
          labelCol={{ span: 5 }}
          name='url'
          rules={[
            { required: true, message: '请输入请求地址' }
          ]}
        >
          <Input autoComplete="on" allowClear placeholder='请输入请求地址' />
        </Form.Item>
        <Form.Item
          label='图标样式'
          labelCol={{ span: 5 }}
          name='icon'
        >
          <Input autoComplete="on" allowClear placeholder='请输入图标样式' />
        </Form.Item>
        <Form.Item
          label='权限类型'
          labelCol={{ span: 5 }}
          name='type'
          rules={[
            { required: true, message: '请选择权限类型' }
          ]}
        >
          <Select placeholder='请选择权限类型'>
            <Select.Option value="menu">菜单</Select.Option>
            <Select.Option value="button">按钮</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='权限标识'
          labelCol={{ span: 5 }}
          name='permission'
          rules={[
            { required: true, message: '请输入权限标识' }
          ]}
        >
          <Input autoComplete="on" allowClear placeholder='请选择权限标识' />
        </Form.Item>
        <Form.Item
          label='权限区分'
          labelCol={{ span: 5 }}
          name='functionType'
          rules={[
            { required: true, message: '请选择权限区分' }
          ]}
        >
          <Select placeholder='请选择权限区分'>
            {Object.keys(FUNCTION_TYPE).map(v => (
              <Select.Option key={v} value={v}>{FUNCTION_TYPE[v]}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label='排序号'
          labelCol={{ span: 5 }}
          name='sort'
          rules={[
            { required: true, message: '输入排序号' }
          ]}
        >
          <InputNumber min={1} precision={0} parser={(value: any) => value.replace(/[^\d]/g, '')} autoComplete="on" placeholder='请输入排序号' />
        </Form.Item>
        <div className='t-center'>
          <Button type='primary' htmlType='submit' loading={loading}>提交</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default Authority
