export const HomeSideItems = [
  {
    patch: '/designer/start',
    class: 'btn-primary',
    text: '开始创作',
    isFinished: true,
    icon: 'add'
  },
  {
    patch: '/mine',
    class: 'btn-ghost',
    text: '我的页面',
    isFinished: false,
    icon: 'page'
  },
  {
    divider: true
  },
  {
    patch: '/admin',
    class: 'btn-ghost',
    text: '后台管理',
    isFinished: false,
    icon: 'admin'
  },
  {
    patch: '/docs',
    class: 'btn-ghost',
    text: '接口文档',
    isFinished: false,
    icon: 'doc'
  }
];


export const DesignerComponents = [
  {
    text: '基础',
    key: 'basic',
    icon: 'computer'
  },
  {
    text: '图片',
    key: 'image',
    icon: 'image'
  }
]
