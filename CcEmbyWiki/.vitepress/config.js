export default {
  title: '起点站 Wiki',
  description: '基于 VitePress 的 起点站 文档站点',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '起点站附属项目',
        items: [
          {
            text: '起点机场',
            link: '/column/Travel/' // 表示docs/column/Travel/index.md
          },
          {
            text: '起点私服',
            link: '/column/Growing/' // 表示docs/column/Growing/index.md
          }
        ]
      },
    ],
    sidebar: {
      '/guide/': [
        { text: '   ', link: '' },
        { text: '   ', link: '' },
        { text: 'Emby 初体验', link: '/guide/emby-intro' },
        { text: '如何注册与保持', link: '/guide/registration' },
        { text: '使用教程', link: '/guide/tutorial' },
        { text: '公益服使用条款', link: '/guide/terms' },
        { text: 'Emby 客户端分享', link: '/guide/client-sharing' },
        { text: '常见问题', link: '/guide/faq' },
        { text: '隐私与安全', link: '/guide/privacy' },
        { text: '关于 起点站', link: '/guide/about' }
      ]
    },
    outline: {
      label: '本页内容' // 修改 "On this page" 为中文
    }
  }
}
