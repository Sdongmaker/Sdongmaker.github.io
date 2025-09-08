# 起点站 Wiki

基于 VitePress 构建的起点站文档站点，提供Emby服务相关的使用指南和帮助文档。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署到 GitHub Pages

此项目已配置 GitHub Actions 自动部署工作流。当推送到 `main` 分支时，会自动构建并部署到 GitHub Pages。

#### 设置步骤：

1. 在 GitHub 仓库设置中，转到 **Settings** > **Pages**
2. 在 **Source** 部分选择 **GitHub Actions**
3. 推送代码到 `main` 分支即可自动部署

## 📁 项目结构

```
├── .github/workflows/    # GitHub Actions 工作流
├── .vitepress/          # VitePress 配置
│   ├── config.js        # 站点配置
│   └── theme/           # 主题相关文件
├── guide/               # 指南文档
├── project/             # 项目相关文档
├── public/              # 静态资源
│   ├── assets/          # 图片资源
│   └── icons/           # 图标文件
├── index.md             # 首页
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 📝 内容管理

### 添加新页面

1. 在相应目录下创建 `.md` 文件
2. 在 `.vitepress/config.js` 中更新导航和侧边栏配置
3. 提交更改，GitHub Actions 会自动部署

### 图片资源

- 将图片文件放在 `public/assets/` 目录下
- 在 Markdown 中使用 `/assets/图片名.jpg` 引用

## 🛠️ 配置说明

### 站点配置

主要配置文件：`.vitepress/config.js`

- `base`: 根据仓库名配置基础路径
- `title` 和 `description`: 站点标题和描述
- `themeConfig`: 主题相关配置（导航、侧边栏等）

### GitHub Actions

工作流文件：`.github/workflows/deploy.yml`

- 自动构建：在推送到 main 分支时触发
- 自动部署：构建完成后部署到 GitHub Pages
- Node.js 版本：20
- 缓存策略：使用 npm 缓存加速构建

## 🔗 相关链接

- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 📄 许可证

MIT License
