# GitHub Pages 部署脚本
# 使用方法: .\deploy.ps1

Write-Host "开始部署到 GitHub Pages..." -ForegroundColor Green

# 检查是否在正确的目录
if (!(Test-Path "package.json")) {
    Write-Host "错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 安装依赖
Write-Host "安装依赖..." -ForegroundColor Yellow
npm install

# 构建项目
Write-Host "构建项目..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败!" -ForegroundColor Red
    exit 1
}

# 检查 git 状态
Write-Host "检查 Git 状态..." -ForegroundColor Yellow
git status

# 添加所有文件
Write-Host "添加文件到 Git..." -ForegroundColor Yellow
git add .

# 提交更改
$commitMessage = Read-Host "请输入提交信息 (默认: Deploy to GitHub Pages)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy to GitHub Pages"
}

git commit -m $commitMessage

# 推送到远程仓库
Write-Host "推送到 GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "部署完成! 请在 GitHub Actions 中查看部署状态。" -ForegroundColor Green
Write-Host "网站将在几分钟后在以下地址可用:" -ForegroundColor Cyan
Write-Host "https://你的用户名.github.io/Nano-Bananary/" -ForegroundColor Cyan