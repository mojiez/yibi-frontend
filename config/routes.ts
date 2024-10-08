export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/add_chart', name: '添加图表页', icon: 'smile', component: './AddChart' },
  { path: '/add_chart_async', name: '异步添加图表页', icon: 'smile', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表', icon: 'smile', component: './MyChart' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/add_chart' },
  { path: '*', layout: false, component: './404' },
];
