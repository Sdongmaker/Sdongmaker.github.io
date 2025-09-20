# 🍌 Nano Bananary - GitHub Pages 部署指南

## 📋 部署前准备

### 1. 确保你有以下权限：
- GitHub 账号的管理权限
- 能够创建和管理仓库
- 能够设置 GitHub Pages

### 2. 项目已配置完成：
✅ Vite 配置已更新支持 GitHub Pages  
✅ GitHub Actions 工作流已创建  
✅ 部署脚本已准备就绪  

## 🚀 部署步骤

### 方法一：使用 PowerShell 脚本（推荐）

1. **在项目目录中运行部署脚本：**
   ```powershell
   .\deploy.ps1
   ```

2. **按提示输入提交信息**

3. **等待自动推送到 GitHub**

### 方法二：手动部署

1. **添加并提交所有文件：**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **在 GitHub 仓库中启用 Pages：**
   - 进入仓库设置 (Settings)
   - 找到 Pages 选项
   - Source 选择 "GitHub Actions"
   - 保存设置

3. **等待自动部署完成**

## ⚙️ GitHub Pages 设置

### 启用 GitHub Pages：

1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**
5. 点击 **Save**

### 设置环境变量（可选）：

如果需要 Gemini API 功能：

1. 进入 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**
3. 添加密钥：
   - Name: `GEMINI_API_KEY`
   - Secret: 你的 Gemini API 密钥

## 🔧 配置说明

### 已完成的配置：

1. **Vite 配置 (`vite.config.ts`)**：
   - 设置了正确的 base path
   - 配置了生产环境构建选项
   - 保持了原有的 API 密钥配置

2. **GitHub Actions 工作流 (`.github/workflows/deploy.yml`)**：
   - 自动构建和部署
   - 支持 Node.js 18
   - 使用官方 Pages 部署 Action

3. **环境变量示例 (`.env.example`)**：
   - 提供了 API 密钥配置模板

## 📱 访问你的网站

部署完成后，你的网站将在以下地址可用：

```
https://你的GitHub用户名.github.io/Nano-Bananary/
```

## 🔍 故障排除

### 如果部署失败：

1. **检查 Actions 日志**：
   - 进入仓库的 Actions 标签
   - 查看最新的工作流运行
   - 检查错误信息

2. **常见问题**：
   - 确保仓库名称为 `Nano-Bananary`
   - 确保主分支名称为 `main` 或 `master`
   - 检查 Pages 设置是否正确

3. **重新触发部署**：
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

## 📝 注意事项

- 首次部署可能需要 5-10 分钟
- 每次推送到 main 分支都会自动重新部署
- API 功能需要设置 GEMINI_API_KEY 环境变量
- 网站更新可能需要几分钟才能生效

## 🎯 下一步

1. 推送代码到你的 GitHub 仓库
2. 启用 GitHub Pages
3. 等待部署完成
4. 访问你的网站！

---

如有问题，请检查 GitHub Actions 的构建日志或联系技术支持。