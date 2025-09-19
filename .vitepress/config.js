import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '起点站 Wiki',
  description: '基于 VitePress 的 起点站 文档站点',
  // GitHub Pages 部署时需要设置正确的 base 路径
  // 如果仓库名为 username.github.io，则 base 为 '/'
  // 如果仓库名为其他名称，则 base 为 '/仓库名/'
  base: '/',
  lastUpdated: true,
  cleanUrls: true, // 启用干净URL（可选）
  ignoreDeadLinks: true, // 忽略无效链接警告
  
  // 站点元数据
  lang: 'zh-CN',
  themeConfig: {
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sdongmaker/Sdongmaker.github.io' }
    ],
    
    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: `Copyright © 2024-${new Date().getFullYear()} 起点站`
    },
    
    // 编辑链接
    editLink: {
      pattern: 'https://github.com/Sdongmaker/Sdongmaker.github.io/edit/main/:path',
      text: '在 GitHub 上编辑此页面'
    },
    
    // 最后更新时间文本
    lastUpdatedText: '最后更新',
    
    // 导航栏
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
            text: '服主养成计划',
            link: '/project/'
          },
          {
            text: '关于起点站',
            link: '/guide/5_about'
          }
        ]
      },
    ],
    
    // 侧边栏
    sidebar: {
      '/guide/': [
        { text: '1. 引言', link: '/guide/1_introduction' },
        { text: '2. 快速入门', link: '/guide/2_how_to_use/quick_start' },
        { text: '3. 常见使用问题', link: '/guide/3_faq' },
        { text: '4. 联系与支持', link: '/guide/4_contact_and_support' },
        { text: '5. 关于起点站', link: '/guide/5_about' }
      ]
    },
    
    // 右侧目录
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    
    // 本地搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },
  
  // HTML head 配置
  head: [
    ['link', { rel: 'icon', href: '/icons/测试.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['meta', { name: 'og:site_name', content: '起点站 Wiki' }],
    ['meta', { name: 'og:image', content: '/icons/测试.png' }]
  ]
})