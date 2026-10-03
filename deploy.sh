#!/bin/bash
set -e

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
NC=$'\033[0m'

log_info()    { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

PROJECT_DIR="$HOME/sit-saljsk.rf"
NVM_DIR="$HOME/.nvm"
BUILD_DIR="$PROJECT_DIR/temp-build"

ensure_node() {
    if command -v node &>/dev/null && command -v npm &>/dev/null; then
        log_info "Node.js $(node -v) готов."
        return 0
    fi
    log_warn "Устанавливаем Node.js через NVM..."
    if [ ! -s "$NVM_DIR/nvm.sh" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    if ! command -v node &>/dev/null; then
        nvm install --lts
        nvm use --lts
        nvm alias default 'lts/*'
    fi
    log_info "Node.js $(node -v) готов."
}

run_deploy() {
    log_info "Начало деплоя..."
    cd "$PROJECT_DIR" || { log_error "Нет папки $PROJECT_DIR"; exit 1; }

    # === ОПТИМИЗАЦИЯ 1: не клонируем заново, а обновляем существующий ===
    if [ -d "$BUILD_DIR/.git" ]; then
        log_info "Обновляем существующий репозиторий (git pull)..."
        cd "$BUILD_DIR"
        GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
            git fetch origin site-v2
        GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
            git reset --hard origin/site-v2
        GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
            git clean -fd
    else
        log_info "Первичное клонирование (shallow, depth=1)..."
        GIT_SSH_COMMAND="ssh -i ~/.ssh/github -o IdentitiesOnly=yes" \
            git clone --depth 1 --branch site-v2 --single-branch \
            git@github.com:DimaNikolaevi4/site.git "$BUILD_DIR"
        cd "$BUILD_DIR"
    fi

    # === ОПТИМИЗАЦИЯ 2: npm ci только если package-lock.json изменился ===
    LOCK_HASH_FILE="$BUILD_DIR/.lockhash"
    CURRENT_LOCK_HASH=$(md5sum package-lock.json | cut -d' ' -f1)
    STORED_LOCK_HASH=""
    [ -f "$LOCK_HASH_FILE" ] && STORED_LOCK_HASH=$(cat "$LOCK_HASH_FILE")

    if [ "$CURRENT_LOCK_HASH" != "$STORED_LOCK_HASH" ]; then
        log_info "Зависимости изменились — устанавливаем (npm ci)..."
        npm ci --no-audit --no-fund
        echo "$CURRENT_LOCK_HASH" > "$LOCK_HASH_FILE"
    else
        log_info "Зависимости не изменились — пропускаем npm ci."
    fi

    # === Сборка ===
    log_info "Собираем проект (build:v2)..."
    npm run build:v2

    # === Копирование в public_html ===
    log_info "Очищаем public_html..."
    cd "$PROJECT_DIR/public_html"
    find . -mindepth 1 -maxdepth 1 \
        ! -name "docs" \
        ! -name "submit-form.php" \
        ! -name "forms.log" \
        ! -name ".htaccess" \
        -exec rm -rf {} +

    log_info "Копируем файлы из public-v2..."
    cp -r "$BUILD_DIR/public-v2/"* "$PROJECT_DIR/public_html/"
    cp "$BUILD_DIR/submit-form.php" "$PROJECT_DIR/public_html/" 2>/dev/null || true

    if [ -f "$PROJECT_DIR/public_html/robots/index.html" ]; then
        mv "$PROJECT_DIR/public_html/robots/index.html" "$PROJECT_DIR/public_html/robots.txt"
        rmdir "$PROJECT_DIR/public_html/robots" 2>/dev/null || true
    fi

    log_info "Устанавливаем права..."
    find "$PROJECT_DIR/public_html" -type f \( \
        -name "*.html" -o -name "*.css" -o -name "*.js" -o \
        -name "*.xml" -o -name "*.txt" -o -name "*.php" \) \
        -exec chmod 644 {} \;
    find "$PROJECT_DIR/public_html" -type d -exec chmod 755 {} \;
    chmod 777 "$PROJECT_DIR/public_html/uploads/forms" 2>/dev/null || true

    # === ОПТИМИЗАЦИЯ 3: НЕ удаляем temp-build — оставляем для следующего деплоя ===
    log_info "Деплой завершён! Сайт: https://сит-сальск.рф"
}

ensure_node
run_deploy
