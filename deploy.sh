#!/usr/bin/env sh

# إيقاف التنفيذ في حالة حدوث أخطاء
set -e

# بناء المشروع
npm run build

# الانتقال إلى مجلد البناء
cd dist

# إنشاء ملف .nojekyll لتجنب معالجة Jekyll
touch .nojekyll

git init
git add -A
git commit -m 'نشر على GitHub Pages'

# إذا كنت تنشر إلى https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:zmsaddi/order-managment.git main:gh-pages

cd -
