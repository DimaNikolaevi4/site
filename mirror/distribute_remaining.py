#!/usr/bin/env python3
import os
import re
import shutil
from pathlib import Path

# Маппинг категорий WordPress в пути структуры папок
CATEGORY_MAPPING = {
    "157": "2_SVEDENIJA",
    "3": "1_ABITURIENTAM",
    "40": "3_UCHEBNO_METODICHESKAYA",
    "26": "4_VOSPITANIE",
    "24": "5_PARTNERSTVO",
    "47": "6_PSIHOLOGICHESKOE",
    "148": "7_BEZOPASNOST",
    "34": "8_STUDENTAM_RODITELJAM",
    
    "1.1. Слово директора": "1_ABITURIENTAM/1_1_SLOVO_DIREKTORA",
    "1.4. День открытых дверей": "1_ABITURIENTAM/1_4_DEN_OTKRYTYH_DVEREY",
    "4. ВОСПИТАТЕЛЬНАЯ РАБОТА": "4_VOSPITANIE",
    "4.6.1. Великая Победа": "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA",
    "4.7.3. Поздравления": "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA",
    "7.3. Противодействие коррупции": "7_BEZOPASNOST/7_3_PROTIVODEYSTVIE_KORRUPTSII",
    "8. СТУДЕНТАМ И ИХ РОДИТЕЛЯМ": "8_STUDENTAM_RODITELJAM",
    "8.1.1. Новости": "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI",
    "8.3. Расписание занятий": "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY",
    "2": "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI",
    "30": "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA",
    "37": "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY",
    "126": "1_ABITURIENTAM/1_1_SLOVO_DIREKTORA",
    "145": "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA",
    "153": "2_SVEDENIJA",
    "155": "2_SVEDENIJA",
    "254": "7_BEZOPASNOST",
    "207": "4_VOSPITANIE",  # Дополнительная категория из файлов
}

def get_categories_from_html(filepath):
    """Извлекает категории из HTML файла"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        categories = re.findall(r'rel="category"[^>]*>([^<]*)', content)
        cat_ids = re.findall(r'\?cat=(\d+)', content)
        
        return categories, cat_ids
    except Exception as e:
        return [], []

def determine_target_path(categories, cat_ids, filename):
    """Определяет целевую папку для файла на основе категорий"""
    
    for cat_name in categories:
        cat_name = cat_name.strip()
        if cat_name in CATEGORY_MAPPING:
            return CATEGORY_MAPPING[cat_name]
    
    for cat_id in cat_ids:
        if cat_id in CATEGORY_MAPPING:
            return CATEGORY_MAPPING[cat_id]
    
    # Эвристики по ключевым словам
    content_lower = filename.lower()
    
    if any("новост" in c.lower() for c in categories):
        return "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI"
    
    if any("распис" in c.lower() for c in categories):
        return "8_STUDENTAM_RODITELJAM/8_3_RASPISANIE_ZANYATIY"
    
    if any("поздрав" in c.lower() for c in categories):
        return "4_VOSPITANIE/4_7_INFORMACIYA/4_7_3_POZDRAVLENIYA"
    
    if any("побед" in c.lower() or "патриот" in c.lower() for c in categories):
        return "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA"
    
    # Default fallbacks
    if "2" in cat_ids or "34" in cat_ids:
        return "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI"
    
    if "26" in cat_ids:
        return "4_VOSPITANIE"
    
    if "157" in cat_ids:
        return "2_SVEDENIJA"
    
    if "40" in cat_ids:
        return "3_UCHEBNO_METODICHESKAYA"
    
    if "24" in cat_ids:
        return "5_PARTNERSTVO"
    
    return None

def main():
    mirror_dir = Path("/workspace/mirror")
    
    # Находим все HTML файлы в корневых папках разделов (не в подпапках)
    files_to_process = []
    for section in ["1_ABITURIENTAM", "2_SVEDENIJA", "3_UCHEBNO_METODICHESKAYA", 
                    "4_VOSPITANIE", "5_PARTNERSTVO", "6_PSIHOLOGICHESKOE",
                    "7_BEZOPASNOST", "8_STUDENTAM_RODITELJAM", "9_DOPOLNITELNYE", "0_BEZ_RUBRIKI"]:
        section_path = mirror_dir / section
        if section_path.exists():
            for f in section_path.glob("*.html"):
                files_to_process.append(f)
    
    print(f"Найдено {len(files_to_process)} файлов для перераспределения")
    
    stats = {
        "total_processed": 0,
        "moved": 0,
        "skipped": 0,
        "by_folder": {}
    }
    
    for filepath in files_to_process:
        filename = filepath.name
        categories, cat_ids = get_categories_from_html(filepath)
        
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
                # Файл уже существует, удаляем дубликат
                os.remove(filepath)
                stats["skipped"] += 1
        else:
            stats["skipped"] += 1
        
        stats["total_processed"] += 1
        
        if stats["total_processed"] % 100 == 0:
            print(f"Обработано {stats['total_processed']} файлов...")
    
    print("\n=== Результаты перераспределения ===")
    print(f"Всего обработано: {stats['total_processed']}")
    print(f"Перемещено: {stats['moved']}")
    print(f"Удалено дубликатов: {stats['skipped']}")
    print("\nПо папкам:")
    for folder, count in sorted(stats["by_folder"].items(), key=lambda x: -x[1]):
        print(f"  {folder}: {count}")

if __name__ == "__main__":
    main()
