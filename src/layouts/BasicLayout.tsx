/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  // DefaultFooter,
  // SettingDrawer,
} from '@ant-design/pro-layout'
import React from 'react'
import { Link, connect, Dispatch, history } from 'umi'


import { Result, Button } from 'antd'
import Authorized from '@/utils/Authorized'
import RightContent from '@/components/GlobalHeader/RightContent'
import LoginPanel from './LoginPanel'
import NProgress from 'nprogress'
import PageLoading from '@/components/PageLoading'

import { ConnectState } from '@/models/connect'
import { getAuthorityFromRouter } from '@/utils/utils'

import logo from '../assets/logo.svg'
import GlobalUI from './GlobalUI'


const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
)
let lastHref = ''

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
  route: ProLayoutProps['route'] & {
    authority: string[]
  }
  global: Boolean
  settings: Settings
  dispatch: Dispatch
  app: any
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem
  }
}
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    }
    return Authorized.check(item.authority, localItem, null) as MenuDataItem
  })

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    app,
    global,
    location = {
      pathname: '/',
    },
  } = props

  const { href } = window.location
  if (lastHref !== href) {
    NProgress.start()
    if (!global) {
      NProgress.done()
      lastHref = href
    }
  }


  if (!app.initialized) return <PageLoading />

  // 登录
  if (!app.isLogin) {
    return <LoginPanel />
  }


  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      })
    }
  } // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  }

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || !menuItemProps.path) {
            return defaultDom
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
              <span>{route.breadcrumbName}</span>
            )
        }}
        // footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
        headerContentRender={() => <div>!!!</div>}
      >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      {/* <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      /> */}
      <GlobalUI />
    </>
  )
}

export default connect(({ global, settings, app, loading }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  app,
  global: loading.global
}))(BasicLayout)
