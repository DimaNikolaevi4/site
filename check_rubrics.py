#!/usr/bin/env python3
"""
Проверка соответствия структуры mirror рубрикам с sit-salsk.ru
"""
import os

# Рубрики с сайта (из form select)
rubrics = {
    "1": {
        "name": "1. АБИТУРИЕНТАМ",
        "sub": {
            "126": "1.1. Слово директора",
            "5": "1.2. Специальности и профессии",
            "4": "1.3. Приемная кампания 2025",
            "153": "1.4. День открытых дверей",
            "25": "1.5. Виртуальная экскурсия",
            "245": "1.6. Подача документов по электронной почте",
            "246": "1.7. Подача документов через средства почтовой связи",
            "247": "1.8. Платная основа обучения",
            "248": "1.9. Контакты и график работы",
        }
    },
    "2": {
        "name": "2. СВЕДЕНИЯ ОБ ОБРАЗОВАТЕЛЬНОЙ ОРГАНИЗАЦИИ",
        "sub": {
            "158": "2.1. Основные сведения",
            "159": "2.2. Структура и органы управления образовательной организацией",
            "160": "2.3. Документы",
            "239": "2.3.1. Внутренняя система оценки качества образования (ВСОКО)",
            "216": "2.4. Образование",
            "168": "2.4.1. Вакантные места для приема (перевода) обучающихся",
            "228": "2.4.2. Международное сотрудничество",
            "195": "2.4.3. Инклюзивное образование",
            "23": "2.4.4. Сведения о трудоустройстве выпускников",
            "163": "2.5. Руководство",
            "250": "2.5.1. Педагогический состав",
            "162": "2.6. Образовательные стандарты и требования",
            "164": "2.7. Материально-техническое обеспечение и оснащенность образовательного процесса. Доступная среда",
            "240": "2.7.1. Электронная информационно-образовательная среда",
            "241": "2.7.2. Цифровая (электронная) библиотека",
            "242": "2.7.3. Электронные образовательные ресурсы и(или) профессиональные базы данных",
            "243": "2.7.4. Электронная информационно-образовательная среда на образовательной платформе",
            "244": "2.7.5. Электронное расписание",
            "251": "2.7.6. Организация питания в образовательной организации",
            "166": "2.8. Платные образовательные услуги",
            "217": "2.9. Финансово-хозяйственная деятельность",
            "165": "2.9.1. Стипендии и меры поддержки обучающихся",
        }
    },
    "3": {
        "name": "3. УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА",
        "sub": {
            "220": "3.1. Использование электронного обучения и дистанционных образовательных технологий",
            "161": "3.2. Дополнительное образование",
            "42": "3.4. Практика",
        }
    },
    "4": {
        "name": "4. ВОСПИТАТЕЛЬНАЯ РАБОТА",
        "sub": {
            "233": "4.1. Штаб воспитательной работы",
            "198": "4.2. План воспитательной работы",
            "179": "4.3. Методическое объединение руководителей учебных групп",
            "199": "4.4. Студенческое самоуправление",
            "202": "4.5. Волонтерское движение",
            "257": "4.5.1. ВОЛОНТЁРСКИЙ ОТРЯД «РАДУГА ДОБРА»",
            "200": "4.6. Патриотическое воспитание",
            "145": "4.6.1. Великая Победа",
            "256": "4.6.2. СТУДЕНЧЕСКИЙ ВОЕННО-ПАТРИОТИЧЕСКИЙ КЛУБ «ВИТЯЗЬ»",
            "201": "4.7. Культурно-массовая работа",
            "234": "4.7.1. Студенческий театральный клуб \"Мираж\"",
            "254": "4.7.2. Молодежный студенческий медиацентр «Новости СИТ»",
            "30": "4.7.3. Поздравления",
            "255": "4.7.4. Первичное отделение «Движение Первых» ГБПОУ РО «СИТ»",
            "27": "4.8. Физическая культура и спорт",
            "229": "4.8.1. ССК \"Авангард\"",
            "144": "4.9. Уполномоченный по правам ребенка",
        }
    },
    "5": {
        "name": "5. СОЦИАЛЬНОЕ ПАРТНЕРСТВО И ПРОФОРИЕНТАЦИЯ",
        "sub": {
            "209": "5.1. Сотрудничество с ВУЗами",
            "208": "5.2. Сотрудничество с органами занятости населения",
            "210": "5.3. Сотрудничество с предприятиями и организациями",
            "207": "5.4. Сотрудничество со школами",
        }
    },
    "6": {
        "name": "6. ПСИХОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ ОБРАЗОВАТЕЛЬНОГО ПРОЦЕССА",
        "sub": {
            "138": "6.1. Организационно-методическая и правовая основа деятельности педагога-психолога",
            "141": "6.2. Результаты психологических тестирований",
            "143": "6.3. Советы психолога — преподавателям",
            "142": "6.4. Советы психолога — родителям",
            "140": "6.5. Советы психолога — студентам",
            "221": "6.6. Профилактика незаконного употребления наркотиков и психоактивных веществ",
            "147": "6.7. Психологическая поддержка лиц с ОВЗ и инвалидов",
        }
    },
    "7": {
        "name": "7. КОМПЛЕКСНАЯ БЕЗОПАСНОСТЬ ОБРАЗОВАТЕЛЬНОГО УЧРЕЖДЕНИЯ",
        "sub": {
            "212": "7.1. Антитеррористическая защищенность",
            "213": "7.2. Профилактика экстремизма и терроризма",
            "155": "7.3. Противодействие коррупции",
            "214": "7.4. Пожарная безопасность",
        }
    },
    "8": {
        "name": "8. СТУДЕНТАМ И ИХ РОДИТЕЛЯМ",
        "sub": {
            "150": "8.1. Информационно-образовательные ресурсы",
            "2": "8.1.1. Новости",
            "43": "8.1.2. Библиотека техникума",
            "39": "8.2. Приказ о зачислении",
            "37": "8.3. Расписание занятий",
        }
    },
    "9": {
        "name": "Дополнительные разделы",
        "sub": {
            "46": "9.4. Результаты изучения общественного мнения (анкетирование, опросы, тестирование)",
            "45": "9.5. Нашим выпускникам",
        }
    },
    "0": {
        "name": "Без рубрики",
        "sub": {}
    }
}

# Mapping названий в пути
slug_map = {
    "1.1": "1.1_Slovo_direktora",
    "1.2": "1.2_Specialnosti_i_professii",
    "1.3": "1.3_Priemnaya_kampaniya_2026",
    "1.4": "1.4_Den_otkrytyh_dverej",
    "1.5": "1.5_Virtualnaya_ekskursiya",
    "1.6": "1.6_Podacha_elektronnaya_pochta",
    "1.7": "1.7_Podacha_pochtovaya_svyaz",
    "1.8": "1.8_Platnaya_osnova",
    "1.9": "1.9_Kontakty_i_grafik",
    "2.1": "2.1_Osnovnye_svedenija",
    "2.2": "2.2_Struktura_i_organy_upravleniya",
    "2.3": "2.3_Dokumenty",
    "2.3.1": "2.3.1_VSOKO",
    "2.4": "2.4_Obrazovanie",
    "2.4.1": "2.4.1_Vakantnye_mesta",
    "2.4.2": "2.4.2_Mezhdunarodnoe_sotrudnichestvo",
    "2.4.3": "2.4.3_Inklyuzivnoe_obrazovanie",
    "2.4.4": "2.4.4_Trudoustrojstvo_vypusknikov",
    "2.5": "2.5_Rukovodstvo",
    "2.5.1": "2.5.1_Pedagogicheskiy_sostav",
    "2.6": "2.6_Obrazovatelnye_standarty",
    "2.7": "2.7_Materialno_tehnicheskoe",
    "2.7.1": "2.7.1_Elektronnaya_ios",
    "2.7.2": "2.7.2_Elektronnaya_biblioteka",
    "2.7.3": "2.7.3_Elektronnye_resursy",
    "2.7.4": "2.7.4_Platforma",
    "2.7.5": "2.7.5_Elektronnoe_raspisanie",
    "2.7.6": "2.7.6_Pitanie",
    "2.8": "2.8_Platnye_uslugi",
    "2.9": "2.9_Finansovo_hozyajstvennaya",
    "2.9.1": "2.9.1_Stipendii",
    "3.1": "3.1_Elektronnoe_obuchenie",
    "3.2": "3.2_Dopolnitelnoe_obrazovanie",
    "3.4": "3.4_Praktika",
    "4.1": "4.1_Shtab",
    "4.2": "4.2_Plan",
    "4.3": "4.3_MO_rukovoditelej",
    "4.4": "4.4_Samoupravlenie",
    "4.5": "4.5_Volonterstvo",
    "4.5.1": "4.5.1_Raduga_dobra",
    "4.6": "4.6_Patrioticheskoe",
    "4.6.1": "4.6.1_Velikaya_Pobeda",
    "4.6.2": "4.6.2_Vityaz",
    "4.7": "4.7_Kulturno_massovaya",
    "4.7.1": "4.7.1_Teatralnyj_klub",
    "4.7.2": "4.7.2_Mediacentr",
    "4.7.3": "4.7.3_Pozdravlenija",
    "4.7.4": "4.7.4_Dvizhenie_pervyh",
    "4.8": "4.8_Fizkultura_sport",
    "4.8.1": "4.8.1_SSK_Avangard",
    "4.9": "4.9_Upolnomochennyj_prava",
    "5.1": "5.1_VUZY",
    "5.2": "5.2_Zanyatost",
    "5.3": "5.3_Predprijatija",
    "5.4": "5.4_Shkoly",
    "6.1": "6.1_Organizacionno_metodicheskaya",
    "6.2": "6.2_Rezultaty_testirovanij",
    "6.3": "6.3_Sovety_prepodavatelyam",
    "6.4": "6.4_Sovety_roditelyam",
    "6.5": "6.5_Sovety_studentam",
    "6.6": "6.6_Profilaktika_narkotikov",
    "6.7": "6.7_Podderzhka_ovz",
    "7.1": "7.1_Antiterror",
    "7.2": "7.2_Ekstremizm",
    "7.3": "7.3_Korrupcija",
    "7.4": "7.4_Pozharnaya_bezopasnost",
    "8.1": "8.1_Resursy",
    "8.1.1": "8.1.1_Novosti",
    "8.1.2": "8.1.2_Biblioteka",
    "8.2": "8.2_Prikaz_zachislenie",
    "8.3": "8.3_Raspisanie",
    "9.4": "9.4_Obshestvennoe_mnenie",
    "9.5": "9.5_Vypusknikam",
}

main_folder_map = {
    "1": "1_ABITURIENTAM",
    "2": "2_SVEDENIJA",
    "3": "3_UCHEBNO_METODICHESKAYA",
    "4": "4_VOSPITANIE",
    "5": "5_PARTNERSTVO",
    "6": "6_PSIHOLOGICHESKOE",
    "7": "7_BEZOPASNOST",
    "8": "8_STUDENTAM_RODITELJAM",
    "9": "9_DOPOLNITELNYE",
    "0": "0_BEZ_RUBRIKI",
}

mirror_base = "/workspace/mirror"

print("=" * 80)
print("ПРОВЕРКА СТРУКТУРЫ mirror ПО РУБРИКАМ sit-salsk.ru")
print("=" * 80)

missing_folders = []
missing_html = []
existing_with_html = []
existing_without_html = []

for main_id, main_data in rubrics.items():
    main_name = main_data["name"]
    main_folder = main_folder_map.get(main_id)
    
    if not main_folder:
        print(f"\n⚠️ Нет маппинга для раздела {main_id}: {main_name}")
        continue
    
    main_path = os.path.join(mirror_base, main_folder)
    
    # Проверка основной папки
    if not os.path.isdir(main_path):
        missing_folders.append((main_id, main_name, main_path))
        print(f"\n❌ ОТСУТСТВУЕТ РАЗДЕЛ {main_id}: {main_name}")
        print(f"   Путь: {main_path}")
        continue
    
    # Проверка подразделов
    for sub_id, sub_name in main_data["sub"].items():
        # Определяем уровень вложенности
        parts = sub_id.split(".")
        level = len(parts)
        
        if level == 1:
            # Уровень 1 (например, 1.1)
            slug_key = f"{parts[0]}.{parts[1]}" if len(parts) > 1 else None
            if not slug_key:
                continue
            sub_folder = slug_map.get(slug_key)
            if not sub_folder:
                missing_folders.append((sub_id, sub_name, f"{main_path}/{sub_folder}"))
                print(f"   ❌ Нет папки для {sub_id}: {sub_name}")
                continue
            
            sub_path = os.path.join(main_path, sub_folder)
        elif level == 2:
            # Уровень 2 (например, 2.3.1)
            parent_key = f"{parts[0]}.{parts[1]}"
            child_key = sub_id
            parent_folder = slug_map.get(parent_key)
            child_folder = slug_map.get(child_key)
            
            if not parent_folder or not child_folder:
                missing_folders.append((sub_id, sub_name, f"{main_path}/.../{child_folder}"))
                print(f"   ❌ Нет маппинга для {sub_id}: {sub_name}")
                continue
            
            sub_path = os.path.join(main_path, parent_folder, child_folder)
        else:
            continue
        
        # Проверка существования папки
        if not os.path.isdir(sub_path):
            missing_folders.append((sub_id, sub_name, sub_path))
            print(f"   ❌ ОТСУТСТВУЕТ {sub_id}: {sub_name}")
            print(f"      Путь: {sub_path}")
            continue
        
        # Проверка наличия index.html
        index_file = os.path.join(sub_path, "index.html")
        has_html = os.path.isfile(index_file)
        
        if has_html:
            existing_with_html.append((sub_id, sub_name, sub_path))
        else:
            existing_without_html.append((sub_id, sub_name, sub_path))
            missing_html.append((sub_id, sub_name, sub_path))

print("\n" + "=" * 80)
print("СВОДКА")
print("=" * 80)
print(f"\n✅ Папок с HTML файлами: {len(existing_with_html)}")
print(f"⚠️  Папок без HTML файлов: {len(existing_without_html)}")
print(f"❌ Отсутствующих папок: {len(missing_folders)}")

if missing_html:
    print("\n" + "=" * 80)
    print("СПИСОК ПАПОК БЕЗ index.html (ТРЕБУЮТ ЗАПОЛНЕНИЯ)")
    print("=" * 80)
    for sub_id, sub_name, path in missing_html:
        print(f"  {sub_id}: {sub_name}")
        print(f"     Путь: {path}")

if missing_folders:
    print("\n" + "=" * 80)
    print("СПИСОК ОТСУТСТВУЮЩИХ ПАПОК")
    print("=" * 80)
    for sub_id, sub_name, path in missing_folders:
        print(f"  {sub_id}: {sub_name}")
        print(f"     Путь: {path}")

