# filepath: /Users/sdongmaker/VScode/wiki/CcEmbyWiki/deploy.sh
#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# 进入构建文件夹
cd .vitepress/dist

# 如果你是要部署到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果你要部署到 https://<USERNAME>.github.io
git push -f git@github.com:Sdongmaker/sdongmaker.github.io.git main

cd -