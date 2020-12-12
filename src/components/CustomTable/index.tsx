import React, { FC, ReactNode } from "react"
import ProTable from "@ant-design/pro-table"
import { Button } from "antd"

import { mapValues, pickBy, trim } from "lodash"
import { useLocation, history } from "umi"
// import numeralFormat from "@/utils/numeralFormat"
import moment from "moment"
import { INIT_PARAMS } from "@/constants"
import { getUUID } from "@/utils/utils"

interface ICustomProps { 
  loading: boolean
  columns: any[]
  dataSource: any[]
  total: number
  showTotal?: ReactNode
  searchNode?: any,
  onRow?: any
  search?: boolean
  dateField?: string
  startDateField?: string
  endDateField?: string
}

const CustomTable: FC<ICustomProps> = ({ 
  loading, 
  onRow, 
  columns, 
  dataSource, 
  total, 
  showTotal, 
  searchNode, 
  search = true,
  dateField,
  startDateField,
  endDateField
}) => {
  const location: any = useLocation()
  
  return (
    <ProTable
      loading={loading}
      columns={columns}
      rowKey="id"
      options={false}
      dataSource={dataSource}
      onRow={onRow}
      pagination={{
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        // showTotal: (t) => showTotal && showTotal(t) || `共有${numeralFormat(t)}条记录`,
        current: Number(location?.query?.page || INIT_PARAMS.page),
        pageSize: Number(location?.query?.pageSize || INIT_PARAMS.pageSize),
        onChange: (page, pageSize) => {
          history.push({
            pathname: location.pathname,
            query: { ...location.query, page, pageSize }
          })
        },
        onShowSizeChange: (current, pageSize) => {
          history.push({
            pathname: location.pathname,
            query: { ...location.query, page: 1, pageSize }
          })
        }
      }}
      search={search ? {
        labelWidth: 'auto',
        defaultCollapsed: false,
        optionRender: (_, { form }) => [
          searchNode ? searchNode(form) :
          <Button
            key="search"
            type="primary"
            onClick={() => {
              let searchQuery = {}
              if (dateField && startDateField && endDateField) {
                searchQuery = {
                  ...form?.getFieldsValue(),
                  [startDateField]: form?.getFieldValue(dateField) && moment(form?.getFieldValue(dateField)[0]).format('YYYY-MM-DD'),
                  [endDateField]: form?.getFieldValue(dateField) && moment(form?.getFieldValue(dateField)[1]).format('YYYY-MM-DD'),
                }
              } else {
                searchQuery = form?.getFieldsValue()
              }

              history.push({
                pathname: location.pathname,
                query: {
                  uuid: getUUID(),
                  ...mapValues(pickBy(searchQuery, (v: any) => !!v), (v: any) => trim(v)),
                }
              })
            }}
          >
            查询
          </Button>,
          <Button
            key="rest"
            onClick={async () => {
              await history.replace({
                pathname: location.pathname,
                query: {
                  uuid: getUUID()
                }
              })
              setTimeout(() => form?.resetFields(), 0)
            }}
          >
            重置
          </Button>,
          <Button key="out">导出</Button>,
        ],
      } : false}
    />
  )
}

export default CustomTable
