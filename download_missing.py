import urllib.request
import os

# Список первых 15 недостающих файлов с их category_id
missing_files = [
    ("/workspace/mirror/2_SVEDENIJA/2.7_Materialno_tehnicheskoe", 164),
    ("/workspace/mirror/2_SVEDENIJA/2.8_Platnye_uslugi", 166),
    ("/workspace/mirror/2_SVEDENIJA/2.9_Finansovo_hozyajstvennaya", 217),
    ("/workspace/mirror/3_UCHEBNO_METODICHESKAYA/3.1_Elektronnoe_obuchenie", 220),
    ("/workspace/mirror/3_UCHEBNO_METODICHESKAYA/3.2_Dopolnitelnoe_obrazovanie", 161),
    ("/workspace/mirror/3_UCHEBNO_METODICHESKAYA/3.4_Praktika", 42),
    ("/workspace/mirror/5_PARTNERSTVO/5.1_VUZY", 209),
    ("/workspace/mirror/5_PARTNERSTVO/5.2_Zanyatost", 208),
    ("/workspace/mirror/5_PARTNERSTVO/5.3_Predprijatija", 210),
    ("/workspace/mirror/5_PARTNERSTVO/5.4_Shkoly", 207),
    ("/workspace/mirror/6_PSIHOLOGICHESKOE/6.1_Organizacionno_metodicheskaya", 138),
    ("/workspace/mirror/6_PSIHOLOGICHESKOE/6.2_Rezultaty_testirovanij", 141),
    ("/workspace/mirror/6_PSIHOLOGICHESKOE/6.3_Sovety_prepodavatelyam", 143),
    ("/workspace/mirror/6_PSIHOLOGICHESKOE/6.4_Sovety_roditelyam", 142),
    ("/workspace/mirror/6_PSIHOLOGICHESKOE/6.5_Sovety_studentam", 140),
]

base_url = "https://sit-salsk.ru/?cat="

downloaded = 0
failed = 0

for dir_path, cat_id in missing_files[:15]:
    url = f"{base_url}{cat_id}"
    output_file = os.path.join(dir_path, "index.html")
    
    try:
        # Создаем директорию если не существует
        os.makedirs(dir_path, exist_ok=True)
        
        # Скачиваем файл
        print(f"Скачивание: {url} -> {output_file}")
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            html_content = response.read()
        
        with open(output_file, 'wb') as f:
            f.write(html_content)
        
        print(f"  ✓ Успешно скачан ({len(html_content)} байт)")
        downloaded += 1
        
    except Exception as e:
        print(f"  ✗ Ошибка: {e}")
        failed += 1

print(f"\nВсего скачано: {downloaded}, ошибок: {failed}")
