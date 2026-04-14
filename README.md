# Сайт ГБПОУ РО "СИТ"
Статический сайт на Eleventy + Decap CMS

## Примечание
Папка `public/` — это артефакт сборки. Она генерируется автоматически при выполнении команды сборки и не должна коммититься в репозиторий.

(docker) mitiba@narnia:~/sit-saljsk.rf/temp-build [0] $ ~/sit-saljsk.rf/deploy.sh
🚀 Начало деплоя...

# Переход в директорию проекта
cd ~/sit-saljsk.rf

# Удаляем старую папку сборки если существует
if [ -d "temp-build" ]; then
    echo "�  Удаляем старую папку temp-build....
    rm -rf temp-build
fi

# Клонируем репозиторий
echo "📦 Клонируем репозиторий....
GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" git clone git@github.com:DimaNikolaevi4/site.git temp-build

# Переходим в папку проекта
cd temp-build
    echo "�  Удаляем старую папку temp-build....
# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости....
npm ci --omit=dev
# Устанавливаем недостающие модули если нужны
npm install js-yaml 2>/dev/null || true
# Собираем проект
echo "🔨 Собираем проект....
npm run build
# Очищаем public_html (кроме важных файлов)
echo "🧹 Очищаем public_html....
cd ~/sit-saljsk.rf/public_html
find . -type f ! -name "submit-form.php" ! -name "forms.log" ! -name ".htaccess" -delete
find . -type d -empty -delete 2>/dev/null || true
# Копируем новые файлы
echo "📋 Копируем файлы сборки....
cp -r ~/sit-saljsk.rf/temp-build/public/* ~/sit-saljsk.rf/public_html/
cp ~/sit-saljsk.rf/temp-build/submit-form.php ~/sit-saljsk.rf/public_html/ 2>/dev/null || true
# Перемещаем robots.txt в корень если он в папке
if [ -f "~/sit-saljsk.rf/public_html/robots/index.html" ]; then
    mv ~/sit-saljsk.rf/public_html/robots/index.html ~/sit-saljsk.rf/public_html/robots.txt
    rmdir ~/sit-saljsk.rf/public_html/robots 2>/dev/null || true
fi
# Устанавливаем правильные права
echo "🔒 Устанавливаем права доступа....
find ~/sit-saljsk.rf/public_html -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.xml" -o -name "*.txt" -o -name "*.php" \) -exec chmod 644 {} \;
find ~/sit-saljsk.rf/public_html -type d -exec chmod 755 {} \;
chmod 777 ~/sit-saljsk.rf/public_html/uploads/forms 2>/dev/null || true
# Очищаем temp-build
echo "🧹 Удаляем временные файлы....
rm -rf ~/sit-saljsk.rf/temp-build
echo "✅ Деплой завершён успешно!
