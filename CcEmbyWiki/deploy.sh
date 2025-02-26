#!/bin/bash

# 构建项目
npm run build

# 进入构建输出目录
cd .vitepress/dist

# 初始化一个新的 Git 仓库
git init
git add -A
git commit -m 'deploy'

# 强制推送到 gh-pages 分支
git push -f https://github.com/Sdongmaker/Sdongmaker.github.io.git main:main

# 返回到项目根目录
cd -