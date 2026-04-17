#!/usr/bin/env python3
import os
import re
import shutil
from pathlib import Path

# Маппинг категорий WordPress в пути структуры папок
# На основе анализа index.html и SITE_RUBRICS_STRUCTURE.md
CATEGORY_MAPPING = {
    # Основные категории из меню
    "157": "2_SVEDENIJA",  # СВЕДЕНИЯ ОБ ОБРАЗОВАТЕЛЬНОЙ ОРГАНИЗАЦИИ
    "3": "1_ABITURIENTAM",  # АБИТУРИЕНТАМ (основная)
    "40": "3_UCHEBNO_METODICHESKAYA",  # УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА
    "26": "4_VOSPITANIE",  # ВОСПИТАТЕЛЬНАЯ РАБОТА
    "24": "5_PARTNERSTVO",  # СОЦИАЛЬНОЕ ПАРТНЕРСТВО
    "47": "6_PSIHOLOGICHESKOE",  # ПСИХОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ
    "148": "7_BEZOPASNOST",  # КОМПЛЕКСНАЯ БЕЗОПАСНОСТЬ
    "34": "8_STUDENTAM_RODITELJAM",  # СТУДЕНТАМ И ИХ РОДИТЕЛЯМ
    
    # Подкатегории - маппинг по названиям
    "1.1. Слово директора": "1_ABITURIENTAM/1_1_SLOVO_DIREKTORA",
    "1.4. День открытых дверей": "1_ABITURIENTAM/1_4_DEN_OTKRYTYH_DVEREY",
    "4. ВОСПИТАТЕЛЬНАЯ РАБОТА": "4_VOSPITANIE",
    "4.6.1. Великая Победа": "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA",
    "4.7.3. Поздравления": "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA",
    "7.3. Противодействие коррупции": "7_BEZOPASNOST/7_3_PROTIVODEYSTVIE_KORRUPTSII",
    "8. СТУДЕНТАМ И ИХ РОДИТЕЛЯМ": "8_STUDENTAM_RODITELJAM",
    "8.1.1. Новости": "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI",
    "8.3. Расписание занятий": "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY",
    "2": "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI",  # cat=2 это Новости
    "30": "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA",  # cat=30 это Поздравления
    "37": "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY",  # cat=37 это Расписание
    "126": "1_ABITURIENTAM",  # needs verification
    "145": "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA",
    "153": "2_SVEDENIJA",  # needs verification
    "155": "2_SVEDENIJA",  # needs verification
    "254": "7_BEZOPASNOST",  # needs verification
}

def get_category_from_html(filepath):
    """Извлекает категории из HTML файла"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Ищем категории в формате rel="category">НАЗВАНИЕ
        categories = re.findall(r'rel="category"[^>]*>([^<]*)', content)
        
        # Также ищем cat= в ссылках
        cat_ids = re.findall(r'\?cat=(\d+)', content)
        
        return categories, cat_ids
    except Exception as e:
        return [], []

def determine_target_path(categories, cat_ids, filename):
    """Определяет целевую папку для файла на основе категорий"""
    
    # Приоритет: ищем по названиям категорий
    for cat_name in categories:
        cat_name = cat_name.strip()
        if cat_name in CATEGORY_MAPPING:
            return CATEGORY_MAPPING[cat_name]
    
    # Если не нашли по названию, пробуем по ID
    for cat_id in cat_ids:
        if cat_id in CATEGORY_MAPPING:
            return CATEGORY_MAPPING[cat_id]
    
    # Если файл содержит "Новости" или является главной страницей с новостями
    if any("новост" in c.lower() for c in categories):
        return "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI"
    
    # Если файл содержит "Расписание"
    if any("распис" in c.lower() for c in categories):
        return "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY"
    
    # Если файл содержит "Поздравления"
    if any("поздрав" in c.lower() for c in categories):
        return "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA"
    
    # Если файл содержит "Великая Победа" или связан с патриотикой
    if any("побед" in c.lower() or "патриот" in c.lower() for c in categories):
        return "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA"
    
    # Default: если есть cat=2 (Новости) или cat=34 (Студентам)
    if "2" in cat_ids or "34" in cat_ids:
        return "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI"
    
    if "26" in cat_ids:
        return "4_VOSPITANIE"
    
    if "157" in cat_ids:
        return "2_SVEDENIJA"
    
    return None

def main():
    unsorted_dir = Path("/workspace/mirror/unsorted")
    mirror_dir = Path("/workspace/mirror")
    
    # Создаем директорию для перемещенных файлов
    moved_dir = unsorted_dir / "moved_to_structure"
    moved_dir.mkdir(exist_ok=True)
    
    stats = {
        "total_processed": 0,
        "moved": 0,
        "skipped": 0,
        "by_folder": {}
    }
    
    # Обрабатываем только HTML файлы (не вложения)
    html_files = [f for f in unsorted_dir.glob("*.html") 
                  if "attachment_id" not in str(f)]
    
    print(f"Найдено {len(html_files)} HTML файлов для обработки (исключая вложения)")
    
    for filepath in html_files:
        filename = filepath.name
        categories, cat_ids = get_category_from_html(filepath)
        
        target_folder = determine_target_path(categories, cat_ids, filename)
        
        if target_folder:
            target_path = mirror_dir / target_folder
            target_path.mkdir(parents=True, exist_ok=True)
            
            dest = target_path / filename
            if not dest.exists():
                shutil.move(str(filepath), str(dest))
                stats["moved"] += 1
                stats["by_folder"][target_folder] = stats["by_folder"].get(target_folder, 0) + 1
            else:
                # Файл уже существует, пропускаем
                stats["skipped"] += 1
        else:
            stats["skipped"] += 1
        
        stats["total_processed"] += 1
        
        if stats["total_processed"] % 100 == 0:
            print(f"Обработано {stats['total_processed']} файлов...")
    
    print("\n=== Результаты ===")
    print(f"Всего обработано: {stats['total_processed']}")
    print(f"Перемещено: {stats['moved']}")
    print(f"Пропущено: {stats['skipped']}")
    print("\nПо папкам:")
    for folder, count in sorted(stats["by_folder"].items(), key=lambda x: -x[1]):
        print(f"  {folder}: {count}")

if __name__ == "__main__":
    main()
