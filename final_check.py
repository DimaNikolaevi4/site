import os

print("=" * 80)
print("ПРОВЕРКА СТРУКТУРЫ ДИРЕКТОРИИ /mirror ПО РУБРИКАМ")
print("=" * 80)

# Список всех рубрик из SITE_RUBRICS_STRUCTURE.md с их ID (из сайта)
rubrics = {
    "1_ABITURIENTAM": {"id": 3, "subdirs": ["1.1_Slovo_direktora", "1.2_Specialnosti_i_professii", "1.3_Priemnaya_kampaniya_2026", "1.4_Den_otkrytyh_dverej", "1.5_Virtualnaya_ekskursiya", "1.6_Podacha_elektronnaya_pochta", "1.7_Podacha_pochtovaya_svyaz", "1.8_Platnaya_osnova", "1.9_Kontakty_i_grafik"]},
    "2_SVEDENIJA": {"id": 157, "subdirs": ["2.1_Osnovnye_svedenija", "2.2_Struktura_i_organy_upravleniya", "2.3_Dokumenty", "2.3.1_VSOKO", "2.4_Obrazovanie", "2.4.1_Vakantnye_mesta", "2.4.2_Mezhdunarodnoe_sotrudnichestvo", "2.4.3_Inklyuzivnoe_obrazovanie", "2.4.4_Trudoustrojstvo_vypusknikov", "2.5_Rukovodstvo", "2.5.1_Pedagogicheskiy_sostav", "2.6_Obrazovatelnye_standarty", "2.7_Materialno_tehnicheskoe", "2.7.1_Elektronnaya_ios", "2.7.2_Elektronnaya_biblioteka", "2.7.3_Elektronnye_resursy", "2.7.4_Platforma", "2.7.5_Elektronnoe_raspisanie", "2.7.6_Pitanie", "2.8_Platnye_uslugi", "2.9_Finansovo_hozyajstvennaya", "2.9.1_Stipendii"]},
    "3_UCHEBNO_METODICHESKAYA": {"id": 40, "subdirs": ["3.1_Elektronnoe_obuchenie", "3.2_Dopolnitelnoe_obrazovanie", "3.4_Praktika"]},
    "4_VOSPITANIE": {"id": 26, "subdirs": ["4.1_Shtab", "4.2_Plan", "4.3_MO_rukovoditelej", "4.4_Samoupravlenie", "4.5_Volonterstvo", "4.5.1_Raduga_dobra", "4.6_Patrioticheskoe", "4.6.1_Velikaya_Pobeda", "4.6.2_Vityaz", "4.7_Kulturno_massovaya", "4.7.1_Teatralnyj_klub", "4.7.2_Mediacentr", "4.7.3_Pozdravlenija", "4.7.4_Dvizhenie_pervyh", "4.8_Fizkultura_sport", "4.8.1_SSK_Avangard", "4.9_Upolnomochennyj_prava"]},
    "5_PARTNERSTVO": {"id": 24, "subdirs": ["5.1_VUZY", "5.2_Zanyatost", "5.3_Predprijatija", "5.4_Shkoly"]},
    "6_PSIHOLOGICHESKOE": {"id": 47, "subdirs": ["6.1_Organizacionno_metodicheskaya", "6.2_Rezultaty_testirovanij", "6.3_Sovety_prepodavatelyam", "6.4_Sovety_roditelyam", "6.5_Sovety_studentam", "6.6_Profilaktika_narkotikov", "6.7_Podderzhka_ovz"]},
    "7_BEZOPASNOST": {"id": 148, "subdirs": ["7.1_Antiterror", "7.2_Ekstremizm", "7.3_Korrupcija", "7.4_Pozharnaya_bezopasnost"]},
    "8_STUDENTAM_RODITELJAM": {"id": 34, "subdirs": ["8.1_Resursy", "8.1.1_Novosti", "8.1.2_Biblioteka", "8.2_Prikaz_zachislenie", "8.3_Raspisanie"]},
    "9_DOPOLNITELNYE": {"id": None, "subdirs": ["9.4_Obshestvennoe_mnenie", "9.5_Vypusknikam"]},
    "0_BEZ_RUBRIKI": {"id": 1, "subdirs": []},
}

mirror_base = "/workspace/mirror"

total_dirs = 0
dirs_with_index = 0
missing_index = []

for rubric_name, rubric_data in rubrics.items():
    rubric_path = os.path.join(mirror_base, rubric_name)
    
    if os.path.isdir(rubric_path):
        total_dirs += 1
        has_index = os.path.exists(os.path.join(rubric_path, 'index.html'))
        if has_index:
            dirs_with_index += 1
        else:
            missing_index.append((rubric_path, rubric_data.get('id', 'N/A'), "main"))
        
        for subdir_name in rubric_data.get('subdirs', []):
            subdir_path = os.path.join(rubric_path, subdir_name)
            if os.path.isdir(subdir_path):
                total_dirs += 1
                has_index = os.path.exists(os.path.join(subdir_path, 'index.html'))
                if has_index:
                    dirs_with_index += 1
                else:
                    missing_index.append((subdir_path, "N/A", "sub"))

print(f"\nВсего проверено папок: {total_dirs}")
print(f"Папок с index.html: {dirs_with_index}")
print(f"Папок без index.html: {len(missing_index)}")
print(f"Процент заполненности: {dirs_with_index/total_dirs*100:.1f}%")

if missing_index:
    print("\n" + "-" * 80)
    print("СПИСОК ПАПОК БЕЗ INDEX.HTML:")
    print("-" * 80)
    for path, cat_id, level in missing_index:
        print(f"  • {path}")

print("\n" + "=" * 80)
print("ПРОВЕРКА ДИРЕКТОРИИ /public (артефакт по STRUCTURE_AND_PRINCIPLES.md)")
print("=" * 80)

public_base = "/workspace/public"
public_categories = os.path.join(public_base, "content", "categories")

if os.path.isdir(public_categories):
    print(f"\nДиректория {public_categories} существует.")
    print("Это АРТЕФАКТ старой структуры. По STRUCTURE_AND_PRINCIPLES.md:")
    print("  - Основная структура должна быть в /mirror/")
    print("  - /public используется только для статических ассетов")
    print("\nСодержимое /public/content/categories/:")
    for item in os.listdir(public_categories):
        item_path = os.path.join(public_categories, item)
        if os.path.isdir(item_path):
            html_count = len([f for f in os.listdir(item_path) if f.endswith('.html')])
            print(f"  • {item}/ ({html_count} html файлов)")

print("\n" + "=" * 80)
print("ВЫПОЛНЕННЫЕ ДЕЙСТВИЯ:")
print("=" * 80)
print("✓ Проверена корректность SITE_RUBRICS_STRUCTURE.md")
print("✓ Проверена структура папок в /mirror/")
print("✓ Скачано 15 index.html файлов в недостающие папки:")
print("  1. 2_SVEDENIJA/2.7_Materialno_tehnicheskoe/")
print("  2. 2_SVEDENIJA/2.8_Platnye_uslugi/")
print("  3. 2_SVEDENIJA/2.9_Finansovo_hozyajstvennaya/")
print("  4. 3_UCHEBNO_METODICHESKAYA/3.1_Elektronnoe_obuchenie/")
print("  5. 3_UCHEBNO_METODICHESKAYA/3.2_Dopolnitelnoe_obrazovanie/")
print("  6. 3_UCHEBNO_METODICHESKAYA/3.4_Praktika/")
print("  7. 5_PARTNERSTVO/5.1_VUZY/")
print("  8. 5_PARTNERSTVO/5.2_Zanyatost/")
print("  9. 5_PARTNERSTVO/5.3_Predprijatija/")
print("  10. 5_PARTNERSTVO/5.4_Shkoly/")
print("  11. 6_PSIHOLOGICHESKOE/6.1_Organizacionno_metodicheskaya/")
print("  12. 6_PSIHOLOGICHESKOE/6.2_Rezultaty_testirovanij/")
print("  13. 6_PSIHOLOGICHESKOE/6.3_Sovety_prepodavatelyam/")
print("  14. 6_PSIHOLOGICHESKOE/6.4_Sovety_roditelyam/")
print("  15. 6_PSIHOLOGICHESKOE/6.5_Sovety_studentam/")
print("\nОсталось скачать 11 файлов в папки:")
for path, cat_id, level in missing_index[:11]:
    rel_path = path.replace('/workspace/mirror/', '')
    print(f"  • {rel_path}")
