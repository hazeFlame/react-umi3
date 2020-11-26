import { useEffect, useReducer, useCallback } from 'react'
import request from './request'
import { INIT_PARAMS } from '../constants'

interface IFetchProps {
  initialUrl: string
  params?: any,
  detail?: boolean
}

export const getQueryString = (filters: any) => {
  return (
    '?' +
    Object.keys(filters)
      .map(key => `${key}=${filters[key]}`)
      .join('&')
  )
}

const dataFetchReducer = (resp: any, action: { type: 'FETCH_INIT' | 'FETCH_SUCCESS' | 'FETCH_FAILURE'; payload?: any }) => {
  switch (action.type) {
    case 'FETCH_INIT': {
      return {
        ...init(action.payload),
        data: {
          ...resp.data,
          result: {
            ...resp.data.result,
            list: resp.data.result.list
          }
        }
      }
    }
    case 'FETCH_SUCCESS': {
      return {
        loading: false,
        isError: false,
        data: action.payload
      }
    }
    case 'FETCH_FAILURE':
      return {
        ...resp,
        loading: false,
        isError: true
      }
    default:
      throw new Error()
  }
}

/**
 * @param {string} initiallUrl
 * @param {object} initialData
 * @returns {object}
 */

const init = (data: any) => data

const data = {
  loading: true,
  isError: false,
  data: {
    code: 0,
    message: "",
    result: {
      list: [],
      page: 1,
      total: 1
    },
    attachment: {}
  }
}

const useFetch = (props: IFetchProps) => {
  const { initialUrl, params, detail } = props
  const initParams = { ...(!detail ? INIT_PARAMS : {}), ...params }
  const [resp, dispatch] = useReducer(dataFetchReducer, data, init)

  const fetchData = useCallback(() => {
    return request(initialUrl, { params: initParams })
  }, [getQueryString(initParams)])

  useEffect(() => {
    let didCancel = false
    dispatch({ type: 'FETCH_INIT', payload: data })
    fetchData().then(res => {
      if (!didCancel && !res.code) {
        dispatch({ type: 'FETCH_SUCCESS', payload: res })
      } else {
        dispatch({ type: 'FETCH_FAILURE' })
      }
    }).catch(e => {
      dispatch({ type: 'FETCH_FAILURE' })
    })
    return () => {
      didCancel = true
    }
  }, [fetchData])

  return resp
}

export default useFetch
