#!/bin/bash

npm run build
cd .vitepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/Sdongmaker/Sdongmaker.github.io.git main:gh-pages
rm -rf .git
cd -