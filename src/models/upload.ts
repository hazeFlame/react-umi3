import { message } from 'antd'
import { getUUID, noop } from '@/utils/utils'
import request from '@/utils/request'
import api from '@/conf/api'
import { getDvaApp } from 'umi'

const state: StateProps = {
  show: false,
  ids: [],
  logos: [],
  entities: {}
}

const { FILE: { GET_UPLOAD_TOKEN } } = api
export default {
  namespace: 'upload',
  state,
  effects: {
    *upload(options: UploadOptions, { call, put }: any) {
      const { upID, cancel } = yield call(uploadFile, options)
      yield put({
        type: 'START',
        payload: {
          name: options.params.name,
          fileName: options?.file?.name,
          upID,
          cancel,
          ...options
        }
      })
    },
    *cancel({ payload: { upID } }: any, { call, put, select }: any) {
      const entity = yield select((state: { upload: { entities: { [x: string]: any } } }) => state.upload.entities[upID])
      if (entity.cancel) {
        yield call(entity.cancel)
      }
      yield put({ type: 'CANCEL', payload: { upID } })
    }
  },
  reducers: {
    SHOW(state: { show: boolean }) {
      state.show = true
      return state
    },
    HIDE: (state: { show: boolean }) => {
      state.show = false
      return state
    },
    START: (state: { ids: any; logos: any; entities: { [x: string]: { path: any } } }, { payload }: any) => {
      const { upID, file, name, cancel, fileName } = payload
      return {
        ...state,
        ids: [...state.ids, upID],
        logos: [...state.logos, name],
        entities: {
          ...state.entities,
          [name]: {
            name,
            path: state.entities[name] ? state.entities[name].path : '',
            speed: '0Kb/s',
            fileName,
            percent: 0,
            file,
            success: false,
            cancel
          }
        },
        show: true
      }
    },
    PROGRESS: (state: { entities: { [x: string]: { percent: any, speed: any} } }, { payload }: any) => {
      const { name, speed, percent } = payload
      if (!state.entities[name]) {
        return state
      }
      state.entities[name].speed = speed
      state.entities[name].percent = percent
      return state
    },
    DONE: (state: { entities: { [x: string]: any } }, { payload }: any) => {
      const { name, path } = payload
      return {
        ...state,
        entities: {
          ...state.entities,
          [name]: {
            ...state.entities[name],
            success: true,
            path
          }
        }
      }
    },
    ERROR: (state: { entities: { [x: string]: any }; ids: any[] }, { payload }: any) => {
      const { upID } = payload
      if (!state.entities[upID]) {
        return state
      }
      delete state.entities[upID]
      state.ids.splice(state.ids.findIndex((id: any) => id === upID), 1)
      return state
    },
    CANCEL: (state: any, { name }: any) => {
      return {
        ...state,
        entities: {
          [name]: undefined
        }
      }
    },
    CLEAR: (state: any) => {
      return {
        show: false,
        ids: [],
        logos: [],
        entities: {}
      }
    }
  }
}

// 获取上传uptoken 默认过期时间为1小时（3600秒）
export const getUploadToken = (
  uploadType: any,
  expirsInSeconds: number = 3600
) => {
  return new Promise((resolve, reject) => {
    request.get(GET_UPLOAD_TOKEN.enum(uploadType).url).then(
      res => {
        const resp: TokenResp = {
          OSSAccessKeyId: res.result.accessid,
          policy: res.result.policy,
          signature: res.result.signature,
          dir: res.result.dir,
          host: res.result.host,

          // up_host: '/aliHost',
          up_host: res.result.host,
          expir: Date.now() + expirsInSeconds * 1000
        }
        resolve(resp)
      }
    ).catch(err => reject(err))
  })
}

export const uploadFile = async (
  options: UploadOptions = {
    done: noop,
    progress: noop,
    error: noop,
    isOriginal: true,
    params: {},
    uploadType: 1
  }
) => {
  const tokenResp: any = await getUploadToken(options.uploadType)
  const upID = getUUID() + options.file?.name.substr(options.file.name.lastIndexOf('.'))
  const xhr = new XMLHttpRequest()
  xhr.open('POST', tokenResp.up_host, true)
  const startDate = Date.now()
  const formData = new FormData()

  formData.append('OSSAccessKeyId', tokenResp.OSSAccessKeyId)
  formData.append('policy', tokenResp.policy)
  formData.append('signature', tokenResp.signature)
  formData.append('key', `${tokenResp.dir}${upID}`) // 文件名字，可设置路径
  formData.append('success_action_status', '200') // 让服务端返回200,不然，默认会返回204
  if (options?.file?.type.startsWith('image') && options.file?.size > 1024 * 1024) {  // 文件类型为图片并且大于1M
    const reader = new FileReader()//图片预览
    reader.readAsDataURL(options?.file)
    reader.onload = function(e) {
      compressImage(e?.target?.result, options.file).then((data) => {
        upload(data)
      })
    }
  } else {
    upload(options.file)
  }

  let taking, isAbort = false

  // Progress
  async function onProgress(evt: { lengthComputable: any; loaded: number; total: number }) {
    if (evt.lengthComputable) {
      const nowDate = Date.now()
      taking = nowDate - startDate
      const x = evt.loaded / 1024
      const y = taking / 1000
      const uploadSpeed = x / y
      let speed
      if (uploadSpeed > 1024) {
        speed = (uploadSpeed / 1024).toFixed(2) + 'Mb/s'
      } else {
        speed = uploadSpeed.toFixed(2) + 'Kb/s'
      }
      const percent = Math.round((evt.loaded * 100) / evt.total)
      if (options.progress) {
        await options.progress(options.params.name, percent, speed)
      }
    }
  }

  async function onDone(response: any) {
    if (isAbort) {
      return
    }
    if (
      xhr.readyState === 4 &&
      (xhr.status >= 200 || xhr.status < 300)
    ) {
      if (options.done) {
        await options.done(options.params.name, `${tokenResp.host}/${tokenResp.dir}${upID}`)
      }
    } else if (xhr.status > 300 || xhr.status < 200) {
      if (xhr.responseText) {
        console && console.error(xhr.responseText)
      }
      if (options.error) {
        await options.error(upID, new Error(xhr.responseText || 'error'))
      }
    }
  }

  function compressImage(data: any, file: File | undefined) {//压缩图片
    return new Promise((resolve, reject) => {
      try {
        let newImgFile
        const quality = 0.8 //压缩图片的质量
        const oldImgLength = data?.length//压缩前的大小
        let compressRadio = ''// 压缩率
        const canvas = document.createElement('canvas') //创建画布
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = data
        img.onload = function() {
          let ratio
          if (img.width > 3000) {
            ratio = 0.5
          } else if (img.width > 2000) {
            ratio = 0.6
          } else if (img.width > 1500) {
            ratio = 0.7
          } else {
            ratio = 0.8
          }
          canvas.width = img.width * ratio  //这里可以自定义你的图片大小
          canvas.height = img.height * ratio
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          const cdata = canvas.toDataURL(file?.type, quality)  //将图片转为Base64 之后预览要用
          const newImgLength = cdata.length
          console.log('img-blob:' + oldImgLength)//压缩前大小
          console.log('ctx-blob:' + newImgLength)//压缩后大小
          compressRadio = (((oldImgLength - newImgLength) / oldImgLength * 100).toFixed(2)) + '%'
          console.log('压缩率:' + compressRadio)
          const arr: any = cdata.split(',')
          const mime = arr[0]?.match(/:(.*?);/)[1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          newImgFile = new File([u8arr], 'compress', { type: mime })
          resolve(newImgFile)
        }
      } catch (e) {
        message.error('上传失败')
        console.log(e)
      }
    })
  }

  function upload(file: any) {
    formData.append('file', file) //文件
    xhr.upload.addEventListener('progress', onProgress, false)
    xhr.addEventListener('readystatechange', onDone, false)
    xhr.send(formData)
  }
  return {
    upID,
    cancel: () => {
      isAbort = true
      xhr.abort()
      getDvaApp()._store.dispatch({ type: 'upload/CANCEL', name: options.params.name })
    }
  }
}

type StateProps = {
  show: boolean
  ids: string[]
  logos: string[]
  entities: object
}

type UploadOptions = {
  file?: File
  done?: (upID: string, resp?: any) => void
  progress?: (name: string, percent?: number, speed?: string) => void
  error?: (upID: string, error?: Error) => void
  isOriginal: boolean
  params: any
  uploadType: any
}

type TokenResp = {
  OSSAccessKeyId: string
  policy: string,
  signature: string
  dir: string
  host: string

  up_host: string
  expir: number
}
