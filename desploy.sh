#!/bin/sh

npm run build

cd dist

git init
git remote add origin git@github.com:mj921/my-tools.git
git add .
git commit -m "desploy"
git push origin gh-pages

rm -rf dist
rm -rf types