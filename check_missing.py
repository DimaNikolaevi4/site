import os

# Список всех рубрик из SITE_RUBRICS_STRUCTURE.md с их ID (из сайта)
rubrics = {
    # 1. АБИТУРИЕНТАМ
    "1_ABITURIENTAM": {
        "id": 3,
        "subdirs": {
            "1.1_Slovo_direktora": 126,
            "1.2_Specialnosti_i_professii": 5,
            "1.3_Priemnaya_kampaniya_2026": 4,
            "1.4_Den_otkrytyh_dverej": 153,
            "1.5_Virtualnaya_ekskursiya": 25,
            "1.6_Podacha_elektronnaya_pochta": 245,
            "1.7_Podacha_pochtovaya_svyaz": 246,
            "1.8_Platnaya_osnova": 247,
            "1.9_Kontakty_i_grafik": 248,
        }
    },
    # 2. СВЕДЕНИЯ ОБ ОБРАЗОВАТЕЛЬНОЙ ОРГАНИЗАЦИИ
    "2_SVEDENIJA": {
        "id": 157,
        "subdirs": {
            "2.1_Osnovnye_svedenija": 158,
            "2.2_Struktura_i_organy_upravleniya": 159,
            "2.3_Dokumenty": 160,
            "2.3.1_VSOKO": 239,
            "2.4_Obrazovanie": 216,
            "2.4.1_Vakantnye_mesta": 168,
            "2.4.2_Mezhdunarodnoe_sotrudnichestvo": 228,
            "2.4.3_Inklyuzivnoe_obrazovanie": 195,
            "2.4.4_Trudoustrojstvo_vypusknikov": 23,
            "2.5_Rukovodstvo": 163,
            "2.5.1_Pedagogicheskiy_sostav": 250,
            "2.6_Obrazovatelnye_standarty": 162,
            "2.7_Materialno_tehnicheskoe": 164,
            "2.7.1_Elektronnaya_ios": 240,
            "2.7.2_Elektronnaya_biblioteka": 241,
            "2.7.3_Elektronnye_resursy": 242,
            "2.7.4_Platforma": 243,
            "2.7.5_Elektronnoe_raspisanie": 244,
            "2.7.6_Pitanie": 251,
            "2.8_Platnye_uslugi": 166,
            "2.9_Finansovo_hozyajstvennaya": 217,
            "2.9.1_Stipendii": 165,
        }
    },
    # 3. УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА
    "3_UCHEBNO_METODICHESKAYA": {
        "id": 40,
        "subdirs": {
            "3.1_Elektronnoe_obuchenie": 220,
            "3.2_Dopolnitelnoe_obrazovanie": 161,
            "3.4_Praktika": 42,
        }
    },
    # 4. ВОСПИТАТЕЛЬНАЯ РАБОТА
    "4_VOSPITANIE": {
        "id": 26,
        "subdirs": {
            "4.1_Shtab": 233,
            "4.2_Plan": 198,
            "4.3_MO_rukovoditelej": 179,
            "4.4_Samoupravlenie": 199,
            "4.5_Volonterstvo": 202,
            "4.5.1_Raduga_dobra": 257,
            "4.6_Patrioticheskoe": 200,
            "4.6.1_Velikaya_Pobeda": 145,
            "4.6.2_Vityaz": 256,
            "4.7_Kulturno_massovaya": 201,
            "4.7.1_Teatralnyj_klub": 234,
            "4.7.2_Mediacentr": 254,
            "4.7.3_Pozdravlenija": 30,
            "4.7.4_Dvizhenie_pervyh": 255,
            "4.8_Fizkultura_sport": 27,
            "4.8.1_SSK_Avangard": 229,
            "4.9_Upolnomochennyj_prava": 144,
        }
    },
    # 5. СОЦИАЛЬНОЕ ПАРТНЕРСТВО
    "5_PARTNERSTVO": {
        "id": 24,
        "subdirs": {
            "5.1_VUZY": 209,
            "5.2_Zanyatost": 208,
            "5.3_Predprijatija": 210,
            "5.4_Shkoly": 207,
        }
    },
    # 6. ПСИХОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ
    "6_PSIHOLOGICHESKOE": {
        "id": 47,
        "subdirs": {
            "6.1_Organizacionno_metodicheskaya": 138,
            "6.2_Rezultaty_testirovanij": 141,
            "6.3_Sovety_prepodavatelyam": 143,
            "6.4_Sovety_roditelyam": 142,
            "6.5_Sovety_studentam": 140,
            "6.6_Profilaktika_narkotikov": 221,
            "6.7_Podderzhka_ovz": 147,
        }
    },
    # 7. КОМПЛЕКСНАЯ БЕЗОПАСНОСТЬ
    "7_BEZOPASNOST": {
        "id": 148,
        "subdirs": {
            "7.1_Antiterror": 212,
            "7.2_Ekstremizm": 213,
            "7.3_Korrupcija": 155,
            "7.4_Pozharnaya_bezopasnost": 214,
        }
    },
    # 8. СТУДЕНТАМ И ИХ РОДИТЕЛЯМ
    "8_STUDENTAM_RODITELJAM": {
        "id": 34,
        "subdirs": {
            "8.1_Resursy": 150,
            "8.1.1_Novosti": 2,
            "8.1.2_Biblioteka": 43,
            "8.2_Prikaz_zachislenie": 39,
            "8.3_Raspisanie": 37,
        }
    },
    # 9. ДОПОЛНИТЕЛЬНЫЕ
    "9_DOPOLNITELNYE": {
        "id": None,
        "subdirs": {
            "9.4_Obshestvennoe_mnenie": 46,
            "9.5_Vypusknikam": 45,
        }
    },
    # 0. БЕЗ РУБРИКИ
    "0_BEZ_RUBRIKI": {
        "id": 1,
        "subdirs": {}
    },
}

mirror_base = "/workspace/mirror"

missing = []
for rubric_name, rubric_data in rubrics.items():
    rubric_path = os.path.join(mirror_base, rubric_name)
    
    # Проверка основной папки
    if os.path.isdir(rubric_path):
        html_files = [f for f in os.listdir(rubric_path) if f.endswith('.html') and f != 'index.html']
        has_index = os.path.exists(os.path.join(rubric_path, 'index.html'))
        
        if not has_index:
            missing.append((rubric_path, rubric_data.get('id', 'N/A'), "main"))
        
        # Проверка подпапок
        for subdir_name, subdir_id in rubric_data.get('subdirs', {}).items():
            subdir_path = os.path.join(rubric_path, subdir_name)
            if os.path.isdir(subdir_path):
                has_index = os.path.exists(os.path.join(subdir_path, 'index.html'))
                if not has_index:
                    missing.append((subdir_path, subdir_id, "sub"))
    
print(f"Всего папок без index.html: {len(missing)}")
print("\nПервые 15 недостающих:")
for i, (path, cat_id, level) in enumerate(missing[:15]):
    print(f"{i+1}. {path} (cat_id={cat_id}, level={level})")

# Сохраним полный список для дальнейшего использования
with open('/workspace/missing_files.txt', 'w') as f:
    for path, cat_id, level in missing:
        f.write(f"{path}|{cat_id}|{level}\n")

print(f"\nПолный список сохранен в /workspace/missing_files.txt")
