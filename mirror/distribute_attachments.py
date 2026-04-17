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
    "126": "1_ABITURIENTAM",
    "145": "4_VOSPITANIE/4_6_PATRIOTICHESKOE/4_6_1_VELIKAYA_POBEDA",
    "153": "2_SVEDENIJA",
    "155": "2_SVEDENIJA",
    "254": "7_BEZOPASNOST",
}

def get_parent_post_id(filepath):
    """Извлекает ID родительского поста из файла вложения"""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Ищем ссылку на родительский пост в формате ?p=XXXX
        matches = re.findall(r'href="[^"]*\?p=(\d+)[^"]*"', content)
        if matches:
            return matches[0]
        
        return None
    except Exception as e:
        return None

def get_category_from_parent(parent_id, mirror_dir):
    """Находит категорию родительского поста"""
    # Ищем файл родительского поста в структуре
    for root, dirs, files in os.walk(mirror_dir):
        for f in files:
            if f"p={parent_id}" in f and f.endswith(".html"):
                parent_path = os.path.join(root, f)
                try:
                    with open(parent_path, 'r', encoding='utf-8', errors='ignore') as pf:
                        content = pf.read()
                    categories = re.findall(r'rel="category"[^>]*>([^<]*)', content)
                    cat_ids = re.findall(r'\?cat=(\d+)', content)
                    
                    for cat_name in categories:
                        cat_name = cat_name.strip()
                        if cat_name in CATEGORY_MAPPING:
                            return CATEGORY_MAPPING[cat_name]
                    
                    for cat_id in cat_ids:
                        if cat_id in CATEGORY_MAPPING:
                            return CATEGORY_MAPPING[cat_id]
                except:
                    pass
    
    return None

def determine_target_path_for_attachment(filepath, mirror_dir):
    """Определяет целевую папку для файла вложения"""
    parent_id = get_parent_post_id(filepath)
    
    if parent_id:
        target = get_category_from_parent(parent_id, mirror_dir)
        if target:
            return target
    
    # Default: если не нашли родителя, помещаем в Новости
    return "8_STUDENTAM_RODITELJAM/8_1_STUDENCHESKAYA_ZHIZN/8_1_1_NOVOSTI"

def main():
    unsorted_dir = Path("/workspace/mirror/unsorted")
    mirror_dir = Path("/workspace/mirror")
    
    stats = {
        "total_processed": 0,
        "moved": 0,
        "skipped": 0,
        "by_folder": {}
    }
    
    # Обрабатываем только файлы вложений
    attachment_files = [f for f in unsorted_dir.glob("*.html") 
                       if "attachment_id" in str(f)]
    
    print(f"Найдено {len(attachment_files)} файлов-вложений для обработки")
    
    for filepath in attachment_files:
        filename = filepath.name
        target_folder = determine_target_path_for_attachment(filepath, mirror_dir)
        
        if target_folder:
            target_path = mirror_dir / target_folder
            target_path.mkdir(parents=True, exist_ok=True)
            
            dest = target_path / filename
            if not dest.exists():
                shutil.move(str(filepath), str(dest))
                stats["moved"] += 1
                stats["by_folder"][target_folder] = stats["by_folder"].get(target_folder, 0) + 1
            else:
                stats["skipped"] += 1
        else:
            stats["skipped"] += 1
        
        stats["total_processed"] += 1
        
        if stats["total_processed"] % 500 == 0:
            print(f"Обработано {stats['total_processed']} файлов...")
    
    print("\n=== Результаты обработки вложений ===")
    print(f"Всего обработано: {stats['total_processed']}")
    print(f"Перемещено: {stats['moved']}")
    print(f"Пропущено: {stats['skipped']}")
    print("\nПо папкам:")
    for folder, count in sorted(stats["by_folder"].items(), key=lambda x: -x[1])[:10]:
        print(f"  {folder}: {count}")

if __name__ == "__main__":
    main()
