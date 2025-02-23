export default {
    title: '起点站 Wiki',
    description: '基于 VitePress 的 起点站 文档站点',
    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        { text: '使用手册', link: '/guide/tutorial' }
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
      }
    }
  }
  