import React, { SyntheticEvent, useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Card, Col, Input, Row, Spin } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { View } from '@/components/hj-lib'

import styled from 'styled-components'
import request from '@/utils/request'
import { history } from 'umi'
import { get } from 'lodash'
import useFetch from '@/utils/useFetch'
import api from '@/conf/api'

const Ification = styled(Card)`
  .ant-card-grid {
    width: 100%;
  }
  .active {
    background-color: #d9f8fb;
  }
`

const { COMMODITY_MANAGEMENT: { CATEGORIES: { LIST_BY_ID, ADD, EDIT, DELETE } } } = api

const CLASS_TITLE = [
  '一级分类',
  '二级分类',
  '三级分类',
  '四级分类',
]

const AAAA = ({ parentId, nodeList, setCurrentNode, setSecondNode, currentNodeListIndex, location }: any) => {
  const [showInput, setShowInput] = useState(false)
  const [value, setValue] = useState('')
  const [count, setCount] = useState(1)
  const { loading, data: { result: { list } } } = useFetch({ initialUrl: LIST_BY_ID.url, detail: true, params: { parentId, count } })

  if (!loading && !location.query.nodes) {
    history.replace({
      path: '/commodityManagement/classification',
      query: {
        nodes: get(location, 'query.nodes', '0')
      }
    })
  }

  const handleInputBlur = () => {
    if (!value) {
      setShowInput(false)
    }
  }

  const handleSaveNode = () => {
    if (!value) return setShowInput(false)
    request.post(ADD.url, {
      data: {
        categoriesName: value,
        parentId
      }
    }).then(res => {
      setCount(count + 1)
      setShowInput(false)
      setValue('')
      setSecondNode(res.result, currentNodeListIndex)
    })
  }


  return (
    <Spin spinning={loading}>
      <Ification title={CLASS_TITLE[currentNodeListIndex]}>
        {list.map((v: { id: string | number; categoriesName: string }) => (
          <Card.Grid onClick={() => setCurrentNode(v.id, currentNodeListIndex)} hoverable={false} className={`pointer ${nodeList[currentNodeListIndex + 1] === v.id ? 'active' : ''}`} key={v.id}>
            <InputValue item={v} setCount={setCount} list={list} setSecondNode={setSecondNode} count={count} currentNodeListIndex={currentNodeListIndex} />
          </Card.Grid>
        ))}
        {showInput && <Card.Grid hoverable={false}>
          <Input placeholder="请输入新分类回车保存" bordered={false} onPressEnter={handleSaveNode} autoFocus value={value} onChange={e => setValue(e.target.value)} onBlur={handleInputBlur} />
        </Card.Grid>}
        <Card.Grid hoverable={false} className='pointer' onClick={() => setShowInput(true)}><PlusOutlined className='m-r-10' />添加</Card.Grid>
      </Ification>
    </Spin>
  )
}

const InputValue = ({ item, setCount, list, setSecondNode, count, currentNodeListIndex }: any) => {
  const [currentEditId, setCurrentEditId] = useState(null)
  const [value, setValue] = useState(item.categoriesName)

  const handleInputBlur = () => {
    setCurrentEditId(null)
  }

  const handleEdit = (e: SyntheticEvent, id: any) => {
    e.stopPropagation()
    setCurrentEditId(id)
  }

  const handleDelete = (e: SyntheticEvent, id: any) => {
    e.stopPropagation()
    request.delete(DELETE.id(id).url).then(res => {
      setCount(count + 1)
      if (list[0].id === id) {
        if (list.length > 1) {
          setSecondNode(list[1].id, currentNodeListIndex)
        } else {
          setSecondNode(null, currentNodeListIndex)
        }
      } else {
        setSecondNode(list[0].id, currentNodeListIndex)
      }
    })
  }

  const handleSaveNode = () => {
    request.put(EDIT.url, {
      data: {
        categoriesName: value,
        id: item.id
      }
    }).then(res => {
      setCount(count + 1)
    })
  }

  return (
    <View row justify='space-between'>
      { currentEditId ?
        <Input placeholder="请输入新分类回车保存" bordered={false} onPressEnter={handleSaveNode} autoFocus value={value} onChange={e => setValue(e.target.value)} onBlur={handleInputBlur} />
        : <span>{item.categoriesName}</span>
      }
      <View row>
        <EditOutlined className="f16 m-r-10" onClick={e => handleEdit(e, item.id)} />
        <DeleteOutlined className="f16" onClick={e => handleDelete(e, item.id)} />
      </View>
    </View>
  )
}

const ClassIfication = ({ location }: any) => {
  const [nodeList, setNodeList] = useState<any>(get(location, 'query.nodes', '0').split(','))

  const setCurrentNode = (id: string, index: number) => {
    const nodes = [...nodeList]
    if (index === 2) return
    if (index === 0 && nodeList.length === 3) {
      nodes.pop()
    }
    nodes.splice(index + 1, 1, id)
    history.replace({
      path: '/commodityManagement/classification',
      query: {
        nodes: nodes.join(',')
      }
    })
    return setNodeList(nodes)
  }

  const setSecondNode = (id?: string, currentNodeListIndex?: any) => {
    const nodes = [...nodeList]
    if (currentNodeListIndex === 2) return
    if (currentNodeListIndex === 0 && nodeList.length === 3) {
      nodes.pop()
    }
    if (!id) {
      const nodess = nodeList.slice(0, currentNodeListIndex + 1)
      history.replace({
        path: '/commodityManagement/classification',
        query: {
          nodes: nodess.join(',')
        }
      })
      return setNodeList(nodess)
    }
    nodes.splice(currentNodeListIndex + 1, 1, id)
    history.replace({
      path: '/commodityManagement/classification',
      query: {
        nodes: nodes.join(',')
      }
    })
    return setNodeList(nodes)
  }

  return (
    <PageContainer>
      <Row gutter={24}>
        {nodeList.map((id: any, index: number) => (
          <Col span={6} key={id}>
            <AAAA parentId={id} setCurrentNode={setCurrentNode} currentNodeListIndex={index} nodeList={nodeList} location={location} setSecondNode={setSecondNode} />
          </Col>
        ))}
      </Row>
    </PageContainer>
  )
}


export default ClassIfication
