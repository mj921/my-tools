#!/bin/sh

npm run build

cd dist

cp index.html 404.html

git init
git checkout -b gh-pages
git add .
git commit -m "desploy"
git push -f git@github.com:mj921/my-tools.git gh-pages:gh-pages

cd ..

rm -rf dist
rm -rf types