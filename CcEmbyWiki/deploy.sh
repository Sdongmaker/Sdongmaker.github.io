#!/bin/bash

# 构建项目
npm run build

# 进入构建输出目录
cd .vitepress/dist

# 初始化一个新的 Git 仓库
git init
git add -A
git commit -m 'deploy'

# 检查是否存在 gh-pages 分支
if git ls-remote --exit-code --heads git@github.com:sdongmaker/wiki.git gh-pages; then
  echo "gh-pages 分支已存在，推送到 gh-pages 分支"
else
  echo "gh-pages 分支不存在，创建并推送到 gh-pages 分支"
fi

# 强制推送到 gh-pages 分支
git push -f git@github.com:sdongmaker/wiki.git master:gh-pages

# 返回到项目根目录
cd -