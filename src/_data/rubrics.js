/**
 * Структура рубрик сайта ГБПОУ РО "СИТ"
 * На основе анализа сайта https://sit-salsk.ru/
 * 
 * Каждый объект имеет поля:
 * - title: название рубрики
 * - slug: URL-идентификатор (транслитерация)
 * - children: массив подрубрик (может быть пустым или отсутствовать)
 */

module.exports = [
  {
    title: "АБИТУРИЕНТАМ",
    slug: "abiturientam",
    children: [
      {
        title: "Слово директора",
        slug: "slovo-direktora"
      },
      {
        title: "Специальности и профессии",
        slug: "specialnosti"
      },
      {
        title: "Приемная кампания 2025",
        slug: "priemnaya-kampaniya-2025"
      },
      {
        title: "День открытых дверей",
        slug: "den-otkrytyh-dverej"
      },
      {
        title: "Виртуальная экскурсия",
        slug: "virtualnaya-ekskursiya"
      },
      {
        title: "Подача документов по электронной почте",
        slug: "podacha-elektronnaya"
      },
      {
        title: "Подача документов через средства почтовой связи",
        slug: "podacha-pochtovaya"
      },
      {
        title: "Платная основа обучения",
        slug: "platnaya-osnova"
      },
      {
        title: "Контакты и график работы",
        slug: "kontakty-grafik"
      }
    ]
  },
  {
    title: "СВЕДЕНИЯ ОБ ОБРАЗОВАТЕЛЬНОЙ ОРГАНИЗАЦИИ",
    slug: "svedenija",
    children: [
      {
        title: "Основные сведения",
        slug: "osnovnye-svedenija"
      },
      {
        title: "Структура и органы управления образовательной организацией",
        slug: "struktura-upravleniya"
      },
      {
        title: "Документы",
        slug: "dokumenty",
        children: [
          {
            title: "Внутренняя система оценки качества образования (ВСОКО)",
            slug: "vsoko"
          }
        ]
      },
      {
        title: "Образование",
        slug: "obrazovanie",
        children: [
          {
            title: "Вакантные места для приема (перевода) обучающихся",
            slug: "vakantnye-mesta"
          },
          {
            title: "Международное сотрудничество",
            slug: "mezhdunarodnoe"
          },
          {
            title: "Инклюзивное образование",
            slug: "inklyuzivnoe"
          },
          {
            title: "Сведения о трудоустройстве выпускников",
            slug: "trudoustrojstvo"
          }
        ]
      },
      {
        title: "Руководство",
        slug: "rukovodstvo",
        children: [
          {
            title: "Педагогический состав",
            slug: "pedagogicheskiy-sostav"
          }
        ]
      },
      {
        title: "Образовательные стандарты и требования",
        slug: "standarty"
      },
      {
        title: "Материально-техническое обеспечение и оснащенность образовательного процесса. Доступная среда",
        slug: "materialno-tehnicheskoe",
        children: [
          {
            title: "Электронная информационно-образовательная среда",
            slug: "elektronnoe-obrazovanie"
          },
          {
            title: "Цифровая (электронная) библиотека",
            slug: "elektronnaya-biblioteka"
          },
          {
            title: "Электронные образовательные ресурсы и(или) профессиональные базы данных",
            slug: "elektronnye-resursy"
          },
          {
            title: "Электронная информационно-образовательная среда на образовательной платформе",
            slug: "platforma"
          },
          {
            title: "Электронное расписание",
            slug: "elektronnoe-raspisanie"
          },
          {
            title: "Организация питания в образовательной организации",
            slug: "pitanie"
          }
        ]
      },
      {
        title: "Платные образовательные услуги",
        slug: "platnye-uslugi"
      },
      {
        title: "Финансово-хозяйственная деятельность",
        slug: "finansy",
        children: [
          {
            title: "Стипендии и меры поддержки обучающихся",
            slug: "stipendii"
          }
        ]
      }
    ]
  },
  {
    title: "УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА",
    slug: "uchebno-metodicheskaya",
    children: [
      {
        title: "Использование электронного обучения и дистанционных образовательных технологий",
        slug: "elektronnoe-obuchenie"
      },
      {
        title: "Дополнительное образование",
        slug: "dopolnitelnoe-obrazovanie"
      },
      {
        title: "Практика",
        slug: "praktika"
      }
    ]
  },
  {
    title: "ВОСПИТАТЕЛЬНАЯ РАБОТА",
    slug: "vospitanie",
    children: [
      {
        title: "Штаб воспитательной работы",
        slug: "shtab"
      },
      {
        title: "План воспитательной работы",
        slug: "plan"
      },
      {
        title: "Методическое объединение руководителей учебных групп",
        slug: "mo-rukovoditelej"
      },
      {
        title: "Студенческое самоуправление",
        slug: "samoupravlenie"
      },
      {
        title: "Волонтерское движение",
        slug: "volonterstvo",
        children: [
          {
            title: "ВОЛОНТЁРСКИЙ ОТРЯД «РАДУГА ДОБРА»",
            slug: "raduga-dobra"
          }
        ]
      },
      {
        title: "Патриотическое воспитание",
        slug: "patrioticheskoe",
        children: [
          {
            title: "Великая Победа",
            slug: "velikaya-pobeda"
          },
          {
            title: "СТУДЕНЧЕСКИЙ ВОЕННО-ПАТРИОТИЧЕСКИЙ КЛУБ «ВИТЯЗЬ»",
            slug: "vitjaz"
          }
        ]
      },
      {
        title: "Культурно-массовая работа",
        slug: "kulturno-massovaya",
        children: [
          {
            title: "Студенческий театральный клуб \"Мираж\"",
            slug: "teatralnyj-klub"
          },
          {
            title: "Молодежный студенческий медиацентр «Новости СИТ»",
            slug: "mediacentr"
          },
          {
            title: "Поздравления",
            slug: "pozdravlenija"
          },
          {
            title: "Первичное отделение «Движение Первых» ГБПОУ РО «СИТ»",
            slug: "dvizhenie-pervyh"
          }
        ]
      },
      {
        title: "Физическая культура и спорт",
        slug: "fizkultura-sport",
        children: [
          {
            title: "ССК \"Авангард\"",
            slug: "ssk-avangard"
          }
        ]
      },
      {
        title: "Уполномоченный по правам ребенка",
        slug: "upolnomochennyj-prava"
      }
    ]
  },
  {
    title: "СОЦИАЛЬНОЕ ПАРТНЕРСТВО И ПРОФОРИЕНТАЦИЯ",
    slug: "partnerstvo",
    children: [
      {
        title: "Сотрудничество с ВУЗами",
        slug: "vuzy"
      },
      {
        title: "Сотрудничество с органами занятости населения",
        slug: "zanyatost"
      },
      {
        title: "Сотрудничество с предприятиями и организациями",
        slug: "predprijatija"
      },
      {
        title: "Сотрудничество со школами",
        slug: "shkoly"
      }
    ]
  },
  {
    title: "ПСИХОЛОГИЧЕСКОЕ СОПРОВОЖДЕНИЕ ОБРАЗОВАТЕЛЬНОГО ПРОЦЕССА",
    slug: "psihologicheskoe",
    children: [
      {
        title: "Организационно-методическая и правовая основа деятельности педагога-психолога",
        slug: "organizacionno-metodicheskaya"
      },
      {
        title: "Результаты психологических тестирований",
        slug: "rezultaty-testirovanij"
      },
      {
        title: "Советы психолога — преподавателям",
        slug: "sovety-prepodavatelyam"
      },
      {
        title: "Советы психолога — родителям",
        slug: "sovety-roditelyam"
      },
      {
        title: "Советы психолога — студентам",
        slug: "sovety-studentam"
      },
      {
        title: "Профилактика незаконного употребления наркотиков и психоактивных веществ",
        slug: "profilaktika-narkotikov"
      },
      {
        title: "Психологическая поддержка лиц с ОВЗ и инвалидов",
        slug: "podderzhka-ovz"
      }
    ]
  },
  {
    title: "КОМПЛЕКСНАЯ БЕЗОПАСНОСТЬ ОБРАЗОВАТЕЛЬНОГО УЧРЕЖДЕНИЯ",
    slug: "bezopasnost",
    children: [
      {
        title: "Антитеррористическая защищенность",
        slug: "antiterror"
      },
      {
        title: "Профилактика экстремизма и терроризма",
        slug: "ekstremizm"
      },
      {
        title: "Противодействие коррупции",
        slug: "korrupcija"
      },
      {
        title: "Пожарная безопасность",
        slug: "pozharnaya"
      }
    ]
  },
  {
    title: "СТУДЕНТАМ И ИХ РОДИТЕЛЯМ",
    slug: "studentam-roditeljam",
    children: [
      {
        title: "Информационно-образовательные ресурсы",
        slug: "resursy",
        children: [
          {
            title: "Новости",
            slug: "novosti"
          },
          {
            title: "Библиотека техникума",
            slug: "biblioteka"
          }
        ]
      },
      {
        title: "Приказ о зачислении",
        slug: "prikaz-zachislenie"
      },
      {
        title: "Расписание занятий",
        slug: "raspisanie"
      }
    ]
  },
  {
    title: "Результаты изучения общественного мнения (анкетирование, опросы, тестирование)",
    slug: "obshestvennoe-mnenie",
    children: []
  },
  {
    title: "Нашим выпускникам",
    slug: "vypusknikam",
    children: []
  },
  {
    title: "Без рубрики",
    slug: "uncategorized",
    children: []
  }
];
