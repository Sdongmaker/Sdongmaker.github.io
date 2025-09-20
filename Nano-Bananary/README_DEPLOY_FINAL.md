# 🍌 Nano Bananary - GitHub Pages 部署完整指南

## ✅ 已完成的配置

### 1. 自定义 API 支持
- ✅ 配置了你的自定义 Gemini API 端点：`https://yqdkzwnuarth.eu-central-1.clawcloudrun.com`
- ✅ 设置了你的 API 密钥：`sk-chocokitty`
- ✅ 修改了服务代码以支持自定义端点和原生 Google API 的自动切换

### 2. GitHub Pages 部署配置
- ✅ 修改了 `vite.config.ts` 支持 GitHub Pages 路径
- ✅ 创建了 GitHub Actions 工作流 (`.github/workflows/deploy.yml`)
- ✅ 配置了环境变量和构建设置

### 3. 部署文件
- ✅ 创建了 PowerShell 部署脚本 (`deploy.ps1`)
- ✅ 配置了环境变量文件 (`.env.local`, `.env.example`)

## 🚀 立即部署步骤

### 方法一：使用部署脚本（推荐）
```powershell
cd Nano-Bananary
.\deploy.ps1
```

### 方法二：手动部署
```bash
cd Nano-Bananary
git add .
git commit -m "Deploy Nano Bananary with custom API to GitHub Pages"
git push origin main
```

## ⚙️ GitHub 设置

### 1. 启用 GitHub Pages
1. 进入你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 在左侧菜单找到 **Pages**
4. **Source** 选择 **"GitHub Actions"**
5. 点击 **Save**

### 2. 验证部署
- 查看 **Actions** 标签中的部署进度
- 部署成功后访问：`https://你的用户名.github.io/Nano-Bananary/`

## 🔧 API 配置说明

### 当前配置：
- **API 端点**：`https://yqdkzwnuarth.eu-central-1.clawcloudrun.com`
- **API 密钥**：`sk-chocokitty`
- **自动检测**：代码会自动检测并使用你的自定义端点

### 如何修改 API 配置：
如果需要更改 API 设置，修改以下文件：
- `.env.local` - 本地开发环境
- `vite.config.ts` - 构建时的默认值
- `.github/workflows/deploy.yml` - GitHub Actions 环境变量

## 📱 功能支持

### ✅ 支持的功能：
- 图像编辑和生成
- 局部涂选编辑
- 连续编辑工作流
- 视频生成（如果你的 API 支持）
- 中文界面
- 浅色/深色主题切换

### 🔄 API 兼容性：
- 自动检测 API 端点类型
- 支持原生 Google Gemini API
- 支持你的自定义轮询 API
- 错误处理和重试机制

## 🎯 部署后验证

### 1. 检查网站是否正常加载
访问：`https://你的用户名.github.io/Nano-Bananary/`

### 2. 测试 API 功能
- 上传一张图片
- 尝试生成或编辑
- 检查是否能正常调用你的 API

### 3. 查看控制台日志
- 打开浏览器开发者工具
- 查看 Console 标签
- 确认 API 调用正常

## 🔍 故障排除

### 如果 API 调用失败：
1. 检查你的 API 服务是否正常运行
2. 验证 API 密钥是否正确
3. 查看浏览器控制台的错误信息
4. 检查 CORS 设置（如果有跨域问题）

### 如果部署失败：
1. 查看 GitHub Actions 的构建日志
2. 确认所有文件都已正确提交
3. 检查 Pages 设置是否正确

### 常见问题：
- **404 错误**：确保 Pages 设置为 "GitHub Actions"
- **API 错误**：检查自定义 API 服务状态
- **构建失败**：查看 Actions 日志中的具体错误

## 📝 注意事项

- 首次部署可能需要 5-10 分钟
- API 密钥已硬编码在构建中，适合演示使用
- 如需生产环境，建议使用环境变量管理敏感信息
- 确保你的 API 服务支持 CORS 跨域请求

---

现在你可以开始部署了！有任何问题随时联系。