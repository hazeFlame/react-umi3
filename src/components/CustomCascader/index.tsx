import React, { FC, useEffect, useState } from 'react'
import { Cascader } from 'antd'
import api from '@/conf/api'
import request from '@/utils/request'
import { drop, findIndex, get } from 'lodash'
import { CascaderOptionType } from 'antd/lib/cascader'

const { GET_AREA } = api


/**
 * @param areaValues [省code，市code，区code ]
 * @param setAddress 回调 
*/

interface ICascader {
  areaValues: string[]
  setAddress: (values: CascaderOptionType[] | undefined) => void
}

const CustomCascader: FC<ICascader> = ({ areaValues, setAddress }) => {
  const [nodeIds, setNodeIds] = useState<any[]>(['0', ...areaValues])
  const [options, setOptions] = useState<any[]>([])

  useEffect(() => {
    getCurrentAreaLevelChildren(nodeIds[0])
  }, [])

  const getCurrentAreaLevelChildren = async (parentId: string) => {
    request.get(GET_AREA.url, { params: { parentId } }).then(async res => {
      if (parentId === nodeIds[0]) {
        console.log(1)
        setOptions(prev => {
          return get(res, 'result.list', []).map((v: any) => ({ ...v, isLeaf: !!v.isLowerLevel ? false : true }))
        })
      } else if (parentId === nodeIds[1]) {
        setOptions(prev => {
          return prev.map(v => {
            if (v.id !== parentId) return v
            return { ...v, children: get(res, 'result.list', []).map((v: any) => ({ ...v, isLeaf: !!v.isLowerLevel ? false : true })) }
          })
        })
      } else if (parentId === nodeIds[2]) {
        setOptions(prev => {
          return prev.map(v => {
            return {
              ...v,
              children: v.children && v.children.map((c: { id: string }) => {
                if (c.id !== parentId) return c
                return { ...c, children: get(res, 'result.list', []) }
              })
            }
          })
        })
      }

      if (nodeIds.length === 1) return
      if (findIndex(nodeIds, id => id === parentId) === nodeIds.length - 2) return
      getCurrentAreaLevelChildren(nodeIds[findIndex(nodeIds, id => id === parentId) + 1])
    })
  }

  const loadData = (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true

    request.get(GET_AREA.url, { params: { parentId: targetOption.id } }).then(res => {
      targetOption.loading = false
      if ((!!get(res, 'result.list', []).length && get(res, 'result.list', [])[0].areaLevel === 3) || !get(res, 'result.list', []).length) {
        targetOption.children = get(res, 'result.list', [])
      } else {
        targetOption.children = get(res, 'result.list', []).map((v: any) => ({ ...v, isLeaf: !!v.isLowerLevel ? false : true }))
      }
      setOptions([...options])
    })
  }

  return (
    <Cascader
      options={options}
      placeholder="请选择地址"
      loadData={loadData}
      allowClear={false}
      value={drop(nodeIds)}
      fieldNames={{ label: 'areaName', value: 'id' }}
      onChange={(values, selectedOptions) => {
        setNodeIds(['0', ...values])
        setAddress(selectedOptions)
      }}
    />
  )
}

export default CustomCascader
