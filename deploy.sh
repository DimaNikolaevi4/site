#!/bin/bash
set -e

# 🎨 Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

log_info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

# 📁 Пути
PROJECT_DIR="$HOME/sit-saljsk.rf"
NVM_DIR="$HOME/.nvm"

# 🔍 Функция: проверка и установка Node.js через NVM
ensure_node() {
    if command -v node &>/dev/null && command -v npm &>/dev/null; then
        log_info "Node.js $(node -v) и npm $(npm -v) уже установлены."
        return 0
    fi

    log_warn "Node.js или npm не найдены. Устанавливаем через NVM..."

    # Если NVM ещё не установлен — ставим
    if [ ! -s "$NVM_DIR/nvm.sh" ]; then
        log_info "Устанавливаем NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi

    # Загружаем NVM в текущую сессию
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 2>/dev/null || true

    # Устанавливаем LTS-версию Node.js, если ещё не установлена
    if ! command -v node &>/dev/null; then
        log_info "Устанавливаем Node.js LTS..."
        nvm install --lts
        nvm use --lts
        nvm alias default 'lts/*'
    fi

    # Финальная проверка
    if ! command -v node &>/dev/null || ! command -v npm &>/dev/null; then
        log_error "Не удалось установить Node.js/npm. Проверьте права доступа и сеть."
        exit 1
    fi

    log_info "✓ Node.js $(node -v) и npm $(npm -v) готовы к работе."
}

# 🚀 Основной процесс деплоя
run_deploy() {
    log_info "🚀 Начало деплоя..."
    cd "$PROJECT_DIR" || { log_error "Не удалось перейти в $PROJECT_DIR"; exit 1; }

    # Удаляем старую папку сборки
    if [ -d "temp-build" ]; then
        log_info "🗑️  Удаляем temp-build..."
        rm -rf temp-build
    fi

    # Клонируем репозиторий
    log_info "📦 Клонируем репозиторий (ветка site-v2)..."
    GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
        git clone --branch site-v2 --single-branch git@github.com:DimaNikolaevi4/site.git temp-build

    cd temp-build

    # Устанавливаем ВСЕ зависимости (включая devDependencies — они нужны для сборки!)
    # Не используем --omit=dev, потому что @11ty/eleventy, clean-css, html-minifier-terser,
    # js-yaml и sharp находятся в devDependencies
    log_info "📦 Устанавливаем все зависимости (включая devDependencies для сборки)..."
    npm ci --no-audit --no-fund

    # Собираем проект в режиме V2 (папка public-v2)
    # ВАЖНО: используем build:v2, а не build — все наши изменения в V2-сборке
    log_info "🔨 Собираем проект (SITE_MODE=v2 → public-v2/)..."
    npm run build:v2

    # Проверяем, что сборка прошла успешно
    if [ ! -d "public-v2" ] || [ -z "$(ls -A public-v2 2>/dev/null)" ]; then
        log_error "Сборка не удалась — папка public-v2 пуста или не существует!"
        exit 1
    fi
    log_info "✓ Сборка завершена. Файлов в public-v2: $(find public-v2 -type f | wc -l)"

    # Очищаем public_html (кроме важных файлов и docs/)
    log_info "🧹 Очищаем public_html (без docs/, submit-form.php, .htaccess)..."
    cd "$PROJECT_DIR/public_html"
    find . -mindepth 1 -maxdepth 1 \
        ! -name "docs" \
        ! -name "submit-form.php" \
        ! -name "forms.log" \
        ! -name ".htaccess" \
        -exec rm -rf {} +

    # Копируем новые файлы из public-v2 (НЕ из public!)
    log_info "📋 Копируем файлы сборки из public-v2/..."
    cp -r "$PROJECT_DIR/temp-build/public-v2/"* "$PROJECT_DIR/public_html/"

    # Копируем submit-form.php, если он есть в репозитории
    if [ -f "$PROJECT_DIR/temp-build/submit-form.php" ]; then
        log_info "📋 Копируем submit-form.php..."
        cp "$PROJECT_DIR/temp-build/submit-form.php" "$PROJECT_DIR/public_html/"
    else
        log_warn "submit-form.php не найден в репозитории. Если он уже есть в public_html/ — останется."
    fi

    # Перемещаем robots.txt, если он в папке robots/
    if [ -f "$PROJECT_DIR/public_html/robots/index.html" ]; then
        mv "$PROJECT_DIR/public_html/robots/index.html" "$PROJECT_DIR/public_html/robots.txt"
        rmdir "$PROJECT_DIR/public_html/robots" 2>/dev/null || true
    fi

    # Устанавливаем права
    log_info "🔒 Устанавливаем права доступа..."
    find "$PROJECT_DIR/public_html" -type f \( \
        -name "*.html" -o -name "*.css" -o -name "*.js" -o \
        -name "*.xml" -o -name "*.txt" -o -name "*.php" \) \
        -exec chmod 644 {} \;
    find "$PROJECT_DIR/public_html" -type d -exec chmod 755 {} \;
    chmod 777 "$PROJECT_DIR/public_html/uploads/forms" 2>/dev/null || true

    # Очищаем temp-build
    log_info "🧹 Удаляем временные файлы..."
    rm -rf "$PROJECT_DIR/temp-build"

    log_info "✅ Деплой завершён успешно!"
    log_info "🌐 Сайт доступен по адресу: https://сит-сальск.рф"
}

# ▶️ Запуск
ensure_node
run_deploy
