import querystring from 'querystring'

// import { queryMenu } from '@/services/menu'

// export function patchRoutes({ routes }: any) {
//   queryMenu().then(res => {
//     const a: any = []
//     // console.log(res)
//     // res.forEach(v => {
//     //   if (v.component) {
//     //     a.push({ ...v, component: require(v.component).defalut })
//     //   } else {
//     //     a.push({
//     //       ...v,
//     //       routes: v.routes.map(d => (
//     //         { ...d, component: require(v.component).default }
//     //       ))
//     //     })
//     //   }
//     // })
//     routes[0].routes = [
//       ...routes[0].routes, 
//       {
//         path: '/aaa',
//         menu: { name: "动态路由", icon: "icon-wenti" },
//         routes: [
//           {
//             path: '/aaa/bbb',
//             menu: { name: "bbbb", icon: "icon-qianyue" },
//             component: require('@/pages/a/b').default,
//           },
//           {
//             path: '/aaa/ccc',
//             menu: { name: "ccc", icon: "icon-qianyue" },
//             component: require('@/pages/a/b').default,
//           },
//           {
//             path: '/aaa/ddd',
//             menu: { name: "ddd", icon: "icon-qianyue" },
//             component: require('@/pages/a/b').default,
//           },
//           {
//             path: '/aaa/fff',
//             menu: { name: "fff", icon: "icon-qianyue" },
//             component: require('@/pages/a/b').default,
//           },
//           {
//             path: '/aaa/ffff',
//             menu: { name: "gasdas", icon: "icon-qianyue" },
//             component: require('@/pages/a/b').default,
//           }
//         ]
//       }
//     ]
//   })
// }

interface IUrl {
  jwt?: string
  new?: string
}
export function render(oldRender: () => void) {
  const parsed: IUrl = querystring.parse(window.location.search.slice(1))
  const jwtFromUrl = parsed.jwt
  if (jwtFromUrl) {
    localStorage.clear()
    localStorage.setItem('token', jwtFromUrl)
    window.location.replace(
      window.location.href
        .replace(/[\?|\&]?jwt\=[\s\S]+$/g, '')
        .replace(/[\?|\&]?new\=[\s\S]+$/g, '')
    )
    return
  }
  oldRender()
}

