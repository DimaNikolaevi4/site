# 1. Подключаемся к Docker-контейнеру
#  ssh localhost -p222


# 3. Переходим в папку проекта
# cd ~/sit-saljsk.rf


# 5. Запускаем деплой
# bash deploy.sh


#!/bin/bash
set -e

# 🎨 Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    log_info "📦 Клонируем репозиторий..."
    GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
        git clone git@github.com:DimaNikolaevi4/site.git temp-build

    cd temp-build

    # Устанавливаем зависимости
    log_info "📦 Устанавливаем зависимости..."
    npm ci --omit=dev
    npm install js-yaml 2>/dev/null || true

    # Собираем проект
    log_info "🔨 Собираем проект..."
    npm run build

    # Очищаем public_html (кроме важных файлов и docs/)
    log_info "🧹 Очищаем public_html (без docs/)..."
    cd "$PROJECT_DIR/public_html"
    find . -mindepth 1 -maxdepth 1 \
        ! -name "docs" \
        ! -name "submit-form.php" \
        ! -name "forms.log" \
        ! -name ".htaccess" \
        -exec rm -rf {} +

    # Копируем новые файлы
    log_info "📋 Копируем файлы сборки..."
    cp -r "$PROJECT_DIR/temp-build/public/"* "$PROJECT_DIR/public_html/"
    cp "$PROJECT_DIR/temp-build/submit-form.php" "$PROJECT_DIR/public_html/" 2>/dev/null || true

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
