const routes = [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        name: "home",
        path: "/",
        component: "./home",
        menu: { name: "首页", icon: "icon-chushengdi-" },
      },
      {
        name: "dashboardaaa",
        path: "dashboard",
        component: "./dashboard",
        menu: { name: "仪表板a", icon: "icon-tongren-" },
      },
      {
        path: "commodityManagement",
        menu: { name: "商品管理", icon: "icon-qianyue" },
        routes: [
          {
            path: 'classification',
            menu: { name: "分类管理", icon: "icon-qianyue" },
            component: './commodityManagement/classification',
          },
          {
            path: 'auditgood',
            menu: { name: "商品审核", icon: "icon-qianyue" },
            component: './commodityManagement/auditgood',
          },
        ]
      },
      {
        path: "merchantManagement",
        menu: { name: "企业管理", icon: "icon-qianyue" },
        routes: [
          {
            path: 'seller',
            menu: { name: "商户端管理", icon: "icon-qianyue" },
            component: './merchantManagement/seller',
          },
          {
            path: 'enterprise',
            menu: { name: "采购端管理", icon: "icon-qianyue" },
            component: './merchantManagement/enterprise',
          },
        ]
      },
      {
        path: "system",
        menu: { name: "系统管理", icon: "icon-qianyue" },
        routes: [
          {
            path: 'function',
            menu: { name: "权限管理", icon: "icon-qianyue" },
            component: './system/function',
          },
          {
            path: 'role',
            menu: { name: "角色管理", icon: "icon-qianyue" },
            component: './system/role',
          },
          {
            path: 'user',
            menu: { name: "用户管理", icon: "icon-qianyue" },
            component: './system/user',
          },
        ]
      }
    ]
  }
]

export default routes
