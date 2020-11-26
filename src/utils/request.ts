/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request'
import { notification } from 'antd'
import { message } from 'antd'
import { getDvaApp } from 'umi'
import { env } from '@/conf'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url } = response

    if (response.status === 401) {
      getDvaApp()._store.dispatch({
        type: 'app/logout',
        reload: true
      })
    }

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    })
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
})

request.interceptors.response.use((response) => {
  if (response.status === 200) {
    const clone = response.clone()
    clone.text()
      .then(data => {
        const resp = JSON.parse(data)
        if (resp.code !== 0) {
          message.error(resp.message)
        }
        // if (resp && !resp.success) {
        //   message.destroy()
        //   if (resp.message === '此账户被停用，如有疑问，请联系管理员') {
        //     message.error({
        //       content: resp.message,
        //       onClose: () => {
        //         getDvaApp()._store.dispatch({
        //           type: 'app/logout',
        //           reload: true
        //         })
        //       }
        //     })
        //   } else {
        //     message.error(resp.message)
        //   }
        // }
      })
  }
  return response
})

request.interceptors.request.use((u, options) => {
  const headers = { ...options.headers }
  if (localStorage.token) {
    headers['mallToken'] = localStorage.token
  }
  headers['Authorization'] = `Basic aHVpamllOmh1aWppZQ==`

  let url = u
  if (process.env.NODE_ENV === 'development' && !url.startsWith('/api') && url.indexOf('reactAMap') === -1) {
    url = `/api${url}`
  }
  return {
    url,
    baseUrl: env.API_URL,
    options: {
      ...options,
      headers
    }
  }
})

export default request
