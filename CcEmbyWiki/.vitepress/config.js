import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '起点站 Wiki',
  description: '基于 VitePress 的 起点站 文档站点',
  base: '/',
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '立即订阅', link: 'https://shop.startednow.org' },
      {
        text: '起点站附属项目',
        items: [
          {
            text: '起点公益机场',
            link: 'https://vpn.28.al/#/login',
            target: '_blank'
          },
          {
            text: '股东项目',
            link: '/column/Growing/'
          },
          {
            text: '服主养成计划',
            link: '/column/Growing/'
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
      label: '本页目录' // 修改 "On this page" 为中文
    },
    search: {
      provider: 'local'
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: '/custom.css' }]
  ]
})