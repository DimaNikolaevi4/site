#!/bin/bash
set -e

echo "🚀 Начало деплоя..."

# Переход в директорию проекта
cd ~/sit-saljsk.rf

# Удаляем старую папку сборки если существует
if [ -d "temp-build" ]; then
    echo "🗑️  Удаляем старую папку temp-build..."
    rm -rf temp-build
fi

# Клонируем репозиторий
echo "📦 Клонируем репозиторий..."
GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" git clone git@github.com:DimaNikolaevi4/site.git temp-build

# Переходим в папку проекта
cd temp-build

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm ci --omit=dev

# Устанавливаем недостающие модули если нужны
npm install js-yaml 2>/dev/null || true

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Очищаем public_html (кроме важных файлов и папки docs/)
# docs/ — документы вне репозитория (~423 МБ), не перезаписываются при деплое
echo "🧹 Очищаем public_html (без docs/)..."
cd ~/sit-saljsk.rf/public_html
find . -mindepth 1 -maxdepth 1 ! -name "docs" ! -name "submit-form.php" ! -name "forms.log" ! -name ".htaccess" -exec rm -rf {} +

# Копируем новые файлы
echo "📋 Копируем файлы сборки..."
cp -r ~/sit-saljsk.rf/temp-build/public/* ~/sit-saljsk.rf/public_html/
cp ~/sit-saljsk.rf/temp-build/submit-form.php ~/sit-saljsk.rf/public_html/ 2>/dev/null || true

# Перемещаем robots.txt в корень если он в папке
if [ -f "~/sit-saljsk.rf/public_html/robots/index.html" ]; then
    mv ~/sit-saljsk.rf/public_html/robots/index.html ~/sit-saljsk.rf/public_html/robots.txt
    rmdir ~/sit-saljsk.rf/public_html/robots 2>/dev/null || true
fi

# Устанавливаем правильные права
echo "🔒 Устанавливаем права доступа..."
find ~/sit-saljsk.rf/public_html -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" -o -name "*.txt" -o -name "*.php" \) -exec chmod 644 {} \;
find ~/sit-saljsk.rf/public_html -type d -exec chmod 755 {} \;
chmod 777 ~/sit-saljsk.rf/public_html/uploads/forms 2>/dev/null || true

# Очищаем temp-build
echo "🧹 Удаляем временные файлы..."
rm -rf ~/sit-saljsk.rf/temp-build

echo "✅ Деплой завершён успешно!"
echo "🌐 Сайт доступен по адресу: https://sit-saljsk.rf"
