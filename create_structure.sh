#!/bin/bash

# Функция для нормализации имени папки
normalize_name() {
    local name="$1"
    
    # Берем только первую часть до "/" если есть (для случаев типа "О нас / About")
    name=$(echo "$name" | cut -d'/' -f1)
    
    # Удаляем номера разделов в начале (например, "1. ", "2.1. ", "9.4. ")
    name=$(echo "$name" | sed -E 's/^[0-9]+(\.[0-9]+)*\.\s*//')
    
    # Переводим в нижний регистр
    name=$(echo "$name" | tr '[:upper:]' '[:lower:]')
    
    # Заменяем пробелы на дефисы
    name=$(echo "$name" | tr ' ' '-')
    
    # Удаляем все специальные символы кроме букв, цифр и дефисов
    # Оставляем только a-z, 0-9, дефис и русские буквы
    name=$(echo "$name" | sed 's/[^a-z0-9а-яё\-]//g')
    
    # Заменяем множественные дефисы на одинарные
    name=$(echo "$name" | sed 's/-\+/-/g')
    
    # Удаляем ведущие и замыкающие дефисы
    name=$(echo "$name" | sed 's/^-//; s/-$//')
    
    echo "$name"
}

# Функция для транслитерации русского текста в латиницу
transliterate() {
    local text="$1"
    
    # Транслитерация русских букв
    text=$(echo "$text" | sed '
        s/а/a/g; s/б/b/g; с/c/g; d/d/g; е/e/g; f/f/g; g/g/g; h/х/g; i/и/g; j/й/g; k/к/g; l/л/g; m/м/g; n/н/g; o/о/g; p/п/g; q/я/g; r/р/g; s/с/g; t/т/g; u/у/g; v/в/g; w/ш/g; x/ь/g; y/ы/g; z/з/g
    ')
    
    # Более точная транслитерация
    text=$(echo "$text" | \
        sed 's/а/a/g' | sed 's/б/b/g' | sed 's/в/v/g' | sed 's/г/g/g' | \
        sed 's/д/d/g' | sed 's/е/e/g' | sed 's/ё/yo/g' | sed 's/ж/zh/g' | \
        sed 's/з/z/g' | sed 's/и/i/g' | sed 's/й/y/g' | sed 's/к/k/g' | \
        sed 's/л/l/g' | sed 's/м/m/g' | sed 's/н/n/g' | sed 's/о/o/g' | \
        sed 's/п/p/g' | sed 's/р/r/g' | sed 's/с/s/g' | sed 's/т/t/g' | \
        sed 's/у/u/g' | sed 's/ф/f/g' | sed 's/х/h/g' | sed 's/ц/ts/g' | \
        sed 's/ч/ch/g' | sed 's/ш/sh/g' | sed 's/щ/sch/g' | sed 's/ъ//g' | \
        sed 's/ы/y/g' | sed 's/ь//g' | sed 's/э/e/g' | sed 's/ю/yu/g' | \
        sed 's/я/ya/g')
    
    echo "$text"
}

# Основная директория
MIRROR_DIR="/workspace/mirror"

# Массив для отслеживания созданных путей
declare -A created_paths

echo "=== Создание структуры папок в mirror/ ==="
echo ""

# Определяем структуру на основе SITE_RUBRICS_STRUCTURE.md
# Используем рекомендации из файла (раздел "Для структуры файлов")

# Функция создания папки с проверкой
create_dir() {
    local path="$1"
    local full_path="${MIRROR_DIR}/${path}"
    
    if [ -d "$full_path" ]; then
        echo "[SKIP] Папка уже существует: ${path}"
        return 0
    fi
    
    if mkdir -p "$full_path" 2>/dev/null; then
        echo "[OK] Создана папка: ${path}"
        return 0
    else
        echo "[ERROR] Не удалось создать папку: ${path}"
        return 1
    fi
}

# Создаем структуру согласно документации в файле
echo "--- Создание основных разделов ---"

# 1. АБИТУРИЕНТАМ -> abiturientam
create_dir "abiturientam"
create_dir "abiturientam/slovo-direktora"
create_dir "abiturientam/specialnosti-i-professii"
create_dir "abiturientam/priemnaya-kampaniya-2025"
create_dir "abiturientam/den-otkrytyh-dverej"
create_dir "abiturientam/virtualnaya-ekskursiya"
create_dir "abiturientam/podacha-dokumentov-po-elektronnoj-pochte"
create_dir "abiturientam/podacha-dokumentov-cherez-sredstva-pochtovoj-svyazi"
create_dir "abiturientam/platnaya-osnova-obucheniya"
create_dir "abiturientam/kontakty-i-grafik-raboty"

# 2. СВЕДЕНИЯ ОБ ОБРАЗОВАТЕЛЬНОЙ ОРГАНИЗАЦИИ -> svedeniya-ob-obrazovatelnoj-organizatsii
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/osnovnye-svedeniya"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/struktura-i-organy-upravleniya"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/dokumenty"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/dokumenty/vnutrennyaya-sistema-otsenki-kachestva-obrazovaniya"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovanie"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovanie/vakantnye-mesta-dlya-priema"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovanie/mezhdunarodnoe-sotrudnichestvo"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovanie/inklyuzivnoe-obrazovanie"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovanie/svedeniya-o-trudoustrojstve-vypusknikov"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/rukovodstvo"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/rukovodstvo/pedagogicheskiy-sostav"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/obrazovatelnye-standarty-i-trebovaniya"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/elektronnaya-informatsionno-obrazovatelnaya-sreda"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/tsifrovaya-biblioteka"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/elektronnye-obrazovatelnye-resursy"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/platforma"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/elektronnoe-raspisanie"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/materialno-tehnicheskoe-obespechenie/organizatsiya-pitaniya"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/platnye-obrazovatelnye-uslugi"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/finansovo-hozyajstvennaya-deyatelnost"
create_dir "svedeniya-ob-obrazovatelnoj-organizatsii/finansovo-hozyajstvennaya-deyatelnost/stipendii-i-mery-podderzhki"

# 3. УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА -> uchebno-metodicheskaya-rabota
create_dir "uchebno-metodicheskaya-rabota"
create_dir "uchebno-metodicheskaya-rabota/ispolzovanie-elektronnogo-obucheniya"
create_dir "uchebno-metodicheskaya-rabota/dopolnitelnoe-obrazovanie"
create_dir "uchebno-metodicheskaya-rabota/praktika"

# 4. ВОСПИТАТЕЛЬНАЯ РАБОТА -> vospitatelnaya-rabota
create_dir "vospitatelnaya-rabota"
create_dir "vospitatelnaya-rabota/shtab-vospitatelnoj-raboty"
create_dir "vospitatelnaya-rabota/plan-vospitatelnoj-raboty"
create_dir "vospitatelnaya-rabota/metodicheskoe-obedinenie-rukovoditelej"
create_dir "vospitatelnaya-rabota/studencheskoe-samoupravlenie"
create_dir "vospitatelnaya-rabota/volonter-skoe-dvizhenie"
create_dir "vospitatelnaya-rabota/volonter-skoe-dvizhenie/volonter-skij-otryad-raduga-dobra"
create_dir "vospitatelnaya-rabota/patrioticheskoe-vospitanie"
create_dir "vospitatelnaya-rabota/patrioticheskoe-vospitanie/velikaya-pobeda"
create_dir "vospitatelnaya-rabota/patrioticheskoe-vospitanie/studencheskiy-voenno-patrioticheskiy-klub-vityaz"
create_dir "vospitatelnaya-rabota/kulturno-massovaya-rabota"
create_dir "vospitatelnaya-rabota/kulturno-massovaya-rabota/studencheskiy-teatralnyy-klub-mirazh"
create_dir "vospitatelnaya-rabota/kulturno-massovaya-rabota/molodezhnyy-studencheskiy-mediacentr-novosti-sit"
create_dir "vospitatelnaya-rabota/kulturno-massovaya-rabota/pozdravleniya"
create_dir "vospitatelnaya-rabota/kulturno-massovaya-rabota/dvizhenie-pervyh"
create_dir "vospitatelnaya-rabota/fizicheskaya-kultura-i-sport"
create_dir "vospitatelnaya-rabota/fizicheskaya-kultura-i-sport/ssk-avangard"
create_dir "vospitatelnaya-rabota/upolnomochennyj-po-pravam-rebenka"

# 5. СОЦИАЛЬНОЕ ПАРТНЕРСТВО И ПРОФОРИЕНТАЦИЯ -> sotsialnoe-partnerstvo-i-proforientatsiya
create_dir "sotsialnoe-partnerstvo-i-proforientatsiya"
create_dir "sotsialnoe-partnerstvo-i-proforientatsiya/sotrudnichestvo-s-vuzami"
create_dir "sotsialnoe-partnerstvo-i-proforientatsiya/sotrudnichestvo-s-organami-zanyatosti"
create_dir "sotsialnoe-partnerstvo-i-proforientatsiya/sotrudnichestvo-s-predpriyatiyami"
create_dir "sotsialnoe-partnerstvo-i-proforientatsiya/sotrudnichestvo-so-shkolami"

# 6. ПСИХОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ -> psihologicheskoe-soprovozhdenie
create_dir "psihologicheskoe-soprovozhdenie"
create_dir "psihologicheskoe-soprovozhdenie/organizatsionno-metodicheskaya-i-pravovaya-osnova"
create_dir "psihologicheskoe-soprovozhdenie/rezultaty-psihologicheskih-testirovanij"
create_dir "psihologicheskoe-soprovozhdenie/sovety-psihologa-prepodavatelyam"
create_dir "psihologicheskoe-soprovozhdenie/sovety-psihologa-roditelyam"
create_dir "psihologicheskoe-soprovozhdenie/sovety-psihologa-studentam"
create_dir "psihologicheskoe-soprovozhdenie/profilaktika-nezakonnogo-upotrebleniya-narkotikov"
create_dir "psihologicheskoe-soprovozhdenie/psihologicheskaya-podderzhka-lits-s-ovz"

# 7. КОМПЛЕКСНАЯ БЕЗОПАСНОСТЬ -> kompleksnaya-bezopasnost
create_dir "kompleksnaya-bezopasnost"
create_dir "kompleksnaya-bezopasnost/antiterroristicheskaya-zashchishchennost"
create_dir "kompleksnaya-bezopasnost/profilaktika-ekstremizma-i-terrorizma"
create_dir "kompleksnaya-bezopasnost/protivodejstvie-korruptsii"
create_dir "kompleksnaya-bezopasnost/pozharnaya-bezopasnost"

# 8. СТУДЕНТАМ И ИХ РОДИТЕЛЯМ -> studentam-i-ih-roditelyam
create_dir "studentam-i-ih-roditelyam"
create_dir "studentam-i-ih-roditelyam/informatsionno-obrazovatelnye-resursy"
create_dir "studentam-i-ih-roditelyam/informatsionno-obrazovatelnye-resursy/novosti"
create_dir "studentam-i-ih-roditelyam/informatsionno-obrazovatelnye-resursy/biblioteka-tehnikuma"
create_dir "studentam-i-ih-roditelyam/prikaz-o-zachislenii"
create_dir "studentam-i-ih-roditelyam/raspisanie-zanyatij"

# 9. Дополнительные разделы
create_dir "rezultaty-izucheniya-obschestvennogo-mneniya"
create_dir "nashim-vypusknikam"

# 0. Без рубрики
create_dir "bez-rubriki"

echo ""
echo "=== Завершение процесса ==="
echo "Структура папок создана в директории: ${MIRROR_DIR}"
