import React, { FC } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';

import { mapValues, pickBy, trim, isEmpty, map } from 'lodash';
import { useLocation, history } from 'umi';
import numeralFormat from '@/utils/numeralFormat';
import moment from 'moment';
import { INIT_PARAMS } from '@/constants';
import { getUUID } from '@/utils/utils';

/**
 * @param {String} dateField 时间字段
 * @param {String} startDateField 时间开始字段
 * @param {String} endDateField 时间结束字段
 */
interface IDateField {
  dateField: string;
  startDateField: string;
  endDateField: string;
}

interface ICustomProps {
  loading: boolean;
  columns: any[];
  dataSource: any[];
  total: number;
  showTotal?: (r: number) => void;
  searchNode?: any;
  onRow?: any;
  search?: boolean;
  dateFilters?: IDateField[];
  exportExcelUrl?: string;
}

/**
 *
 * @param {Boolean} loading
 * @param {} columns
 */
const CustomTable: FC<ICustomProps> = ({
  loading,
  columns,
  dataSource,
  total,
  showTotal,
  searchNode,
  onRow,
  search = true,
  dateFilters,
}) => {
  const location: any = useLocation();

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
        showTotal: (t) => (showTotal && showTotal(t)) || `共有${numeralFormat(t)}条记录`,
        current: Number(location?.query?.page || INIT_PARAMS.page),
        pageSize: Number(location?.query?.pageSize || INIT_PARAMS.pageSize),
        onChange: (page, pageSize) => {
          history.push({
            pathname: location.pathname,
            query: { ...location.query, page, pageSize },
          });
        },
        onShowSizeChange: (current, pageSize) => {
          history.push({
            pathname: location.pathname,
            query: { ...location.query, page: 1, pageSize },
          });
        },
      }}
      search={
        search
          ? {
              labelWidth: 'auto',
              defaultCollapsed: false,
              optionRender: (_, { form }) => [
                searchNode ? (
                  searchNode(form)
                ) : (
                  <Button
                    key="search"
                    type="primary"
                    onClick={() => {
                      let searchQuery = {};
                      if (!isEmpty(dateFilters)) {
                        // 处理时间数据
                        const fileds = map(
                          dateFilters?.map((v) => Object.values(v)),
                          (v) =>
                            form?.getFieldValue(v[0]) && {
                              [v[1]]: moment(form?.getFieldValue(v[0])[0]).format('YYYY-MM-DD'),
                              [v[2]]: moment(form?.getFieldValue(v[0])[1]).format('YYYY-MM-DD'),
                            },
                        ).reduce((p, n) => ({ ...p, ...n }), {});
                        searchQuery = {
                          ...form?.getFieldsValue(),
                          ...fileds,
                        };
                      } else {
                        searchQuery = form?.getFieldsValue();
                      }

                      history.push({
                        pathname: location.pathname,
                        query: {
                          uuid: getUUID(),
                          ...mapValues(
                            pickBy(searchQuery, (v: any) => !!v),
                            (v: any) => trim(v),
                          ),
                        },
                      });
                    }}
                  >
                    查询
                  </Button>
                ),
                <Button
                  key="rest"
                  onClick={async () => {
                    await history.replace({
                      pathname: location.pathname,
                      query: {
                        uuid: getUUID(),
                      },
                    });
                    setTimeout(() => form?.resetFields(), 0);
                  }}
                >
                  重置
                </Button>,
                <Button key="out">导出</Button>,
              ],
            }
          : false
      }
    />
  );
};

export default CustomTable;
