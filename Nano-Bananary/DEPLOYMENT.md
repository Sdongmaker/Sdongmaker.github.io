# GitHub Pages 部署指南

## 自动部署设置

本项目已配置为自动部署到 GitHub Pages。当你推送代码到 `main` 或 `master` 分支时，会自动触发部署。

## 部署步骤

### 1. 推送代码到你的 GitHub 仓库

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 2. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 保存设置

### 3. 设置 API 密钥（可选）

如果需要使用 Gemini API 功能：

1. 在 GitHub 仓库中，进入 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**
3. 名称：`GEMINI_API_KEY`
4. 值：你的 Gemini API 密钥
5. 点击 **Add secret**

### 4. 等待部署完成

- 推送代码后，GitHub Actions 会自动开始构建和部署
- 你可以在 **Actions** 标签中查看部署进度
- 部署完成后，网站将在 `https://你的用户名.github.io/Nano-Bananary/` 可用

## 本地开发

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

## 注意事项

- 确保仓库名称为 `Nano-Bananary`，这样基础路径配置才能正确工作
- 如果你更改了仓库名称，需要同时更新 `vite.config.ts` 中的 `base` 配置
- 首次部署可能需要几分钟时间
- API 密钥是可选的，没有密钥时某些功能可能无法使用