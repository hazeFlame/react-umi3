import React from 'react'
import { Form, Input } from 'antd'
import { PATTERN } from '@/constants'
import request from '@/utils/request'
import api from '@/conf/api'


/**
 *
 * @param {string} placeholder  input placeholder
 * @param {boolean} disabled input disabled
 * @param {string} oldValue 原本值
 * @param {any} formProps formProps
 *
 */

const PatternMobile = ({ placeholder = '请输入', disabled = false, oldValue = '', ...formProps }) => {
  return (
    <Form.Item
      {...formProps}
      rules={[
        { required: true, message: '请输入正确的手机号码!', pattern: PATTERN.mobile },
        ({ getFieldValue }) => ({
          async validator(rule, value) {
            if (value === oldValue) return Promise.resolve()
            if (PATTERN.mobile.test(value)) {
              try {
                const res = await request.get(api.operationManagement.USER.ISEXISTBYMOBILE.mobile(value).url)
                if (!res.queryResult.map.flag) {
                  return Promise.resolve()
                } else {
                  return Promise.reject('用户已存在')
                }
              } catch (err) {
                return Promise.resolve()
              }
            }
          }
        })
      ]}
    >
      <Input
        placeholder={placeholder}
        maxLength={11}
        disabled={disabled}
        autoComplete="on"
        allowClear
        onChange={(e) => {
          if(formProps.form){
            const v = {}
            v[formProps.name] = e.target.value.replace(/[^\d]/g, '')
            formProps.form.setFieldsValue(v)
            formProps.form.validateFields([formProps.name])
          }
        }}
      />
    </Form.Item>
  )
}

export default PatternMobile

export const Mobile = ({ placeholder = '请输入', disabled = false, rules = [{ required: true, message: '请输入正确的手机号码!', pattern: PATTERN.mobile }] , form, name, ...formProps }) => {
  return (
    <Form.Item
      {...formProps}
      name={name}
      rules={rules}
    >
      <Input
        placeholder={placeholder}
        maxLength={11}
        disabled={disabled}
        autoComplete="on"
        allowClear
        onChange={(e) => {
          const v = {}
          v[name] = e.target.value.replace(/[^\d]/g, '')
          form.setFieldsValue(v)
          form.validateFields([name])
        }}
      />
    </Form.Item>
  )
}
