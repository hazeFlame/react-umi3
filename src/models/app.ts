import api from '@/conf/api'
import request from '@/utils/request'
import getParameterByName from '@/utils/getParameterByName'
import { get } from 'lodash'
import jwt from 'jsonwebtoken'

// import { getRoleList } from './role'
// import { getDictList } from './dict'
// import { getCitiesData } from './citiesData'
// import { getNews } from './news'

type ProfileProps = {
  authorities: any
  client_id: number
  exp: string
  id: number
  jti: string
  name: string
  scope: any
  username: string
}

export type IAppState = {
  isLogin: boolean
  initialized: boolean
  profileId: number
  profile: ProfileProps
  loginInfo: any
}

const state: IAppState = {
  isLogin: Boolean(localStorage.token),
  profileId: localStorage.id,
  profile: {
    authorities: [],
    client_id: 0,
    exp: '',
    id: 0,
    jti: '',
    name: '',
    scope: [],
    username: ''
  },
  initialized: false,
  loginInfo: {}
}

export default {
  namespace: 'app',
  state,
  subscriptions: {
    setup({ dispatch }: any) {
      console.log('App Start !!')
      dispatch({ type: 'init' })
    }
  },
  effects: {
    *init(_: any, { call, put, select }: any) {
      if (getParameterByName('jwt')) return
      const { app } = yield select()
      // 无 token 未登陆
      if (!app.isLogin) return yield put({ type: 'DONE' })

      try {
        const resp = yield call(getProfile, { jltToken: window.localStorage.token })
        // const userInfo = yield call(getPhotoProfile)
        const profile = jwt.decode(resp.result)
        yield put({
          type: 'UPDATE',
          data: { 
            profile: {
              ...profile,
              // avatar: get(userInfo, 'queryResult.entity.companyLogo', ''),
              // consignorShortName: get(userInfo, 'queryResult.entity.shortName', '')
            }
          }
        })
        // yield [
        //   (profile.authorities || []).includes('system:role:list') && call(getRoleList),
        //   call(getDictList),
        //   call(getCitiesData),
        //   call(getNews),
        // ]
      } catch (err) {
        console.log(err)
      }

      yield put({ type: 'DONE' })
    },
    *getUserInfo(_: any, { call, put, select }: any) {
      const { app } = yield select()
      const userInfo = yield call(getPhotoProfile)
      yield put({
        type: 'UPDATE',
        data: { 
          profile: {
            ...app.profile,
            avatar: get(userInfo, 'queryResult.entity.companyLogo', ''),
            consignorShortName: get(userInfo, 'queryResult.entity.shortName', '')
          }
        }
      })
    },
    *login({ replace = false, values }: any, { call }: any) {
      try {
        const resp = yield call(login, { ...values })
        if (resp.code === 0) {
          localStorage.setItem('token', resp.result)
          localStorage.setItem('telephone', values.mobile)
          window.location.href = window.location.origin
        }
      } catch (err) {
        throw err
      }

      // yield put({ type: 'SAVE', resp })

      // if (replace) {
      //   window.location.replace(url)
      // } else {
      //   window.location.href = url
      // }
    },
    *logout({ reload = false }, { put }: any) {
      // yield call(logout, { jltToken: window.localStorage.token })
      yield localStorage.clear()
      yield put({ type: 'UPDATE', data: { profile: {} } })
      if (reload) {
        window.location.reload()
      }
    }
  },
  reducers: {
    UPDATE(state: IAppState, { data }: any) {
      return {
        ...state,
        ...data
      }
    },
    SAVE(state: IAppState, { resp }: any) {
      return {
        ...state,
        loginInfo: { success: true }
      }
    },
    DONE(state: IAppState) {
      state.initialized = true
      return state
    }
  }
}

function login(values: any) {
  return request.post(api.LOGIN.url, { data: { ...values } })
}

// function getPhotoProfile() {
//   return request.get(api.PROFILE.url)
// }

function getProfile(values: {} | URLSearchParams | undefined) {
  return request.get(api.GET_PROFILE.url, { params: { ...values } })
}
