#!/usr/bin/env python3
"""
Проверка соответствия структуры mirror рубрикам с sit-salsk.ru
"""
import os

mirror_base = "/workspace/mirror"

# Основные разделы и их папки
main_sections = {
    "1_ABITURIENTAM": [
        "1.1_Slovo_direktora",
        "1.2_Specialnosti_i_professii",
        "1.3_Priemnaya_kampaniya_2026",
        "1.4_Den_otkrytyh_dverej",
        "1.5_Virtualnaya_ekskursiya",
        "1.6_Podacha_elektronnaya_pochta",
        "1.7_Podacha_pochtovaya_svyaz",
        "1.8_Platnaya_osnova",
        "1.9_Kontakty_i_grafik",
    ],
    "2_SVEDENIJA": [
        "2.1_Osnovnye_svedenija",
        "2.2_Struktura_i_organy_upravleniya",
        "2.3_Dokumenty",
        "2.4_Obrazovanie",
        "2.5_Rukovodstvo",
        "2.6_Obrazovatelnye_standarty",
        "2.7_Materialno_tehnicheskoe",
        "2.8_Platnye_uslugi",
        "2.9_Finansovo_hozyajstvennaya",
    ],
    "3_UCHEBNO_METODICHESKAYA": [
        "3.1_Elektronnoe_obuchenie",
        "3.2_Dopolnitelnoe_obrazovanie",
        "3.4_Praktika",
    ],
    "4_VOSPITANIE": [
        "4.1_Shtab",
        "4.2_Plan",
        "4.3_MO_rukovoditelej",
        "4.4_Samoupravlenie",
        "4.5_Volonterstvo",
        "4.6_Patrioticheskoe",
        "4.7_Kulturno_massovaya",
        "4.8_Fizkultura_sport",
        "4.9_Upolnomochennyj_prava",
    ],
    "5_PARTNERSTVO": [
        "5.1_VUZY",
        "5.2_Zanyatost",
        "5.3_Predprijatija",
        "5.4_Shkoly",
    ],
    "6_PSIHOLOGICHESKOE": [
        "6.1_Organizacionno_metodicheskaya",
        "6.2_Rezultaty_testirovanij",
        "6.3_Sovety_prepodavatelyam",
        "6.4_Sovety_roditelyam",
        "6.5_Sovety_studentam",
        "6.6_Profilaktika_narkotikov",
        "6.7_Podderzhka_ovz",
    ],
    "7_BEZOPASNOST": [
        "7.1_Antiterror",
        "7.2_Ekstremizm",
        "7.3_Korrupcija",
        "7.4_Pozharnaya_bezopasnost",
    ],
    "8_STUDENTAM_RODITELJAM": [
        "8.1_Resursy",
        "8.2_Prikaz_zachislenie",
        "8.3_Raspisanie",
    ],
    "9_DOPOLNITELNYE": [
        "9.4_Obshestvennoe_mnenie",
        "9.5_Vypusknikam",
    ],
}

# Подпапки уровня 2
sub_folders = {
    "2_SVEDENIJA": {
        "2.3_Dokumenty": ["2.3.1_VSOKO"],
        "2.4_Obrazovanie": ["2.4.1_Vakantnye_mesta", "2.4.2_Mezhdunarodnoe_sotrudnichestvo", "2.4.3_Inklyuzivnoe_obrazovanie", "2.4.4_Trudoustrojstvo_vypusknikov"],
        "2.5_Rukovodstvo": ["2.5.1_Pedagogicheskiy_sostav"],
        "2.7_Materialno_tehnicheskoe": ["2.7.1_Elektronnaya_ios", "2.7.2_Elektronnaya_biblioteka", "2.7.3_Elektronnye_resursy", "2.7.4_Platforma", "2.7.5_Elektronnoe_raspisanie", "2.7.6_Pitanie"],
        "2.9_Finansovo_hozyajstvennaya": ["2.9.1_Stipendii"],
    },
    "4_VOSPITANIE": {
        "4.5_Volonterstvo": ["4.5.1_Raduga_dobra"],
        "4.6_Patrioticheskoe": ["4.6.1_Velikaya_Pobeda", "4.6.2_Vityaz"],
        "4.7_Kulturno_massovaya": ["4.7.1_Teatralnyj_klub", "4.7.2_Mediacentr", "4.7.3_Pozdravlenija", "4.7.4_Dvizhenie_pervyh"],
        "4.8_Fizkultura_sport": ["4.8.1_SSK_Avangard"],
    },
    "8_STUDENTAM_RODITELJAM": {
        "8.1_Resursy": ["8.1.1_Novosti", "8.1.2_Biblioteka"],
    },
}

print("=" * 80)
print("ПРОВЕРКА СТРУКТУРЫ mirror ПО РУБРИКАМ sit-salsk.ru")
print("=" * 80)

results = {
    "ok_with_html": [],
    "ok_no_html": [],
    "missing_folder": [],
}

for main_folder, sub_list in main_sections.items():
    main_path = os.path.join(mirror_base, main_folder)
    
    if not os.path.isdir(main_path):
        print(f"\n❌ ОТСУТСТВУЕТ РАЗДЕЛ: {main_folder}")
        continue
    
    for sub_folder in sub_list:
        sub_path = os.path.join(main_path, sub_folder)
        
        if not os.path.isdir(sub_path):
            results["missing_folder"].append((main_folder, sub_folder, sub_path))
            print(f"   ❌ НЕТ ПАПКИ: {main_folder}/{sub_folder}")
            continue
        
        # Проверка index.html
        index_file = os.path.join(sub_path, "index.html")
        has_html = os.path.isfile(index_file)
        
        if has_html:
            results["ok_with_html"].append((main_folder, sub_folder))
        else:
            results["ok_no_html"].append((main_folder, sub_folder, sub_path))
    
    # Проверка подпапок уровня 2
    if main_folder in sub_folders:
        for parent_sub, level2_list in sub_folders[main_folder].items():
            parent_path = os.path.join(main_path, parent_sub)
            for child_sub in level2_list:
                child_path = os.path.join(parent_path, child_sub)
                
                if not os.path.isdir(child_path):
                    results["missing_folder"].append((main_folder, f"{parent_sub}/{child_sub}", child_path))
                    print(f"   ❌ НЕТ ПАПКИ УРОВНЯ 2: {main_folder}/{parent_sub}/{child_sub}")
                    continue
                
                index_file = os.path.join(child_path, "index.html")
                has_html = os.path.isfile(index_file)
                
                if has_html:
                    results["ok_with_html"].append((main_folder, f"{parent_sub}/{child_sub}"))
                else:
                    results["ok_no_html"].append((main_folder, f"{parent_sub}/{child_sub}", child_path))

print("\n" + "=" * 80)
print("СВОДКА")
print("=" * 80)
print(f"\n✅ Папок с index.html: {len(results['ok_with_html'])}")
print(f"⚠️  Папок без index.html: {len(results['ok_no_html'])}")
print(f"❌ Отсутствующих папок: {len(results['missing_folder'])}")

if results["ok_no_html"]:
    print("\n" + "=" * 80)
    print("СПИСОК ПАПОК БЕЗ index.html (ТРЕБУЮТ ЗАПОЛНЕНИЯ)")
    print("=" * 80)
    for main_f, sub_f, path in results["ok_no_html"]:
        print(f"  ⚠️  {main_f}/{sub_f}")
        print(f"      Путь: {path}")

if results["missing_folder"]:
    print("\n" + "=" * 80)
    print("СПИСОК ОТСУТСТВУЮЩИХ ПАПОК")
    print("=" * 80)
    for main_f, sub_f, path in results["missing_folder"]:
        print(f"  ❌ {main_f}/{sub_f}")
        print(f"      Путь: {path}")

