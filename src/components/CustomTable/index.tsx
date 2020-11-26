import { INIT_PARAMS } from "@/constants"
import numeralFormat from "@/utils/numeralFormat"
import ProTable from "@ant-design/pro-table"
import React, { FC, ReactNode } from "react"
import { mapValues, pickBy, trim } from "lodash"
import { Button } from "antd"
import { useLocation, history } from "umi"

interface ICustomProps { 
  loading: boolean
  columns: any[]
  dataSource: any[]
  total: number
  showTotal?: ReactNode
  searchNode?: any,
  onRow?: any
}

const CustomTable: FC<ICustomProps> = ({ loading, onRow, columns, dataSource, total, showTotal, searchNode }) => {
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
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
        optionRender: (_, { form }) => [
          searchNode ? searchNode(form) :
          <Button
            key="search"
            type="primary"
            onClick={() => {
              history.push({
                pathname: location.pathname,
                query: {
                  page: 1,
                  ...mapValues(pickBy(form?.getFieldsValue(), (v: any) => !!v), v => trim(v)),
                }
              })
            }}
          >
            查询
          </Button>,
          <Button
            key="rest"
            onClick={async () => {
              await history.push(location.pathname)
              setTimeout(() => form?.resetFields(), 0)
            }}
          >
            重置
          </Button>,
          <Button key="out">导出</Button>,
        ],
      }}
    />
  )
}

export default CustomTable
