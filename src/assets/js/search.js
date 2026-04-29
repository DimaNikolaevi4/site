/**
 * Клиентский поиск с Lunr.js
 * Работает на статическом сайте: загружает JSON-индекс и выполняет поиск в браузере
 * Поддерживает фильтрацию по рубрикам и тегам
 */
(function() {
  'use strict';

  // Состояние поиска
  let searchIndex = null;
  let searchDocuments = [];
  let isLoading = false;
  let isLoaded = false;

  // Рубрики и теги
  let rubricsData = [];
  let availableTags = [];
  let selectedTags = new Set();

  // Элементы DOM
  let searchForm = null;
  let searchInput = null;
  let rubricFilter = null;
  let tagsContainer = null;
  let resultsContainer = null;
  let resultsInfo = null;
  let resultsList = null;
  let tipsContainer = null;

  // Загрузка данных рубрик
  function loadRubricsData() {
    const rubricsScript = document.getElementById('rubricsData');
    if (rubricsScript) {
      try {
        rubricsData = JSON.parse(rubricsScript.textContent) || [];
      } catch (e) {
        console.warn('Failed to parse rubrics data:', e);
        rubricsData = [];
      }
    }
  }

  // Загрузка индекса поиска
  async function loadSearchIndex() {
    if (isLoaded || isLoading) return;
    isLoading = true;

    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error('Failed to load search index');

      const data = await response.json();
      searchDocuments = data.documents || [];

      // Извлекаем уникальные теги
      const tagsSet = new Set();
      searchDocuments.forEach(doc => {
        if (Array.isArray(doc.tags)) {
          doc.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      availableTags = Array.from(tagsSet).sort();

      // Создаём Lunr индекс на клиенте
      searchIndex = lunr(function() {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('excerpt', { boost: 5 });
        this.field('category');
        this.field('rubric');
        this.field('tags', { boost: 3 });

        searchDocuments.forEach(doc => {
          this.add({
            id: doc.id,
            title: doc.title || '',
            excerpt: doc.excerpt || '',
            category: doc.category || '',
            rubric: doc.rubric || '',
            tags: Array.isArray(doc.tags) ? doc.tags.join(' ') : (doc.tags || '')
          });
        });
      });

      isLoaded = true;
      console.log('Search index loaded:', searchDocuments.length, 'documents,', availableTags.length, 'tags');

      // Рендерим теги после загрузки
      renderAvailableTags();

    } catch (error) {
      console.error('Error loading search index:', error);
    } finally {
      isLoading = false;
    }
  }

  // Рендер доступных тегов
  function renderAvailableTags() {
    if (!tagsContainer || availableTags.length === 0) return;

    // Показываем только топ-20 популярных тегов
    const topTags = availableTags.slice(0, 20);

    tagsContainer.innerHTML = topTags.map(tag => `
      <label class="search-tag" data-tag="${escapeHtml(tag)}">
        <input type="checkbox" name="tag" value="${escapeHtml(tag)}">
        <span>${escapeHtml(tag)}</span>
      </label>
    `).join('');

    // Добавляем обработчики
    tagsContainer.querySelectorAll('.search-tag').forEach(label => {
      label.addEventListener('click', function(e) {
        e.preventDefault();
        const checkbox = this.querySelector('input');
        const tag = this.dataset.tag;

        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
          this.classList.remove('active');
          checkbox.checked = false;
        } else {
          selectedTags.add(tag);
          this.classList.add('active');
          checkbox.checked = true;
        }

        // Повторяем поиск если есть запрос
        if (searchInput && searchInput.value.trim()) {
          performAndRenderSearch();
        }
      });
    });
  }

  // Выполнение поиска
  function performSearch(query, rubricSlug = null, tags = []) {
    if (!searchIndex || !query || query.trim().length < 2) {
      return [];
    }

    try {
      // Подготавливаем запрос
      const cleanQuery = query
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 1)
        .map(word => word + '*')
        .join(' ');

      if (!cleanQuery) return [];

      const results = searchIndex.search(cleanQuery);

      // Сопоставляем результаты с документами и применяем фильтры
      let filteredResults = results.map(result => {
        const doc = searchDocuments.find(d => d.id === result.ref);
        return doc ? { ...doc, score: result.score } : null;
      }).filter(Boolean);

      // Фильтр по рубрике
      if (rubricSlug) {
        filteredResults = filteredResults.filter(doc => {
          // Проверяем slug рубрики
          const rubric = rubricsData.find(r => r.slug === rubricSlug);
          if (!rubric) return false;

          // Проверяем совпадение по URL (начинается с /slug/)
          if (doc.url && doc.url.startsWith('/' + rubricSlug + '/')) return true;

          // Проверяем по code рубрики (например "1" для абитуриентам)
          if (doc.rubric && doc.rubric.startsWith(rubric.code)) return true;

          // Проверяем по category
          if (doc.category === rubricSlug) return true;

          return false;
        });
      }

      // Фильтр по тегам
      if (tags && tags.length > 0) {
        filteredResults = filteredResults.filter(doc => {
          if (!Array.isArray(doc.tags)) return false;
          return tags.some(tag => doc.tags.includes(tag));
        });
      }

      return filteredResults.slice(0, 50);

    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Выполнение поиска и рендер результатов
  function performAndRenderSearch() {
    const query = searchInput ? searchInput.value.trim() : '';
    const rubricSlug = rubricFilter ? rubricFilter.value : '';
    const tags = Array.from(selectedTags);

    if (query.length < 2) {
      if (tipsContainer) tipsContainer.style.display = 'block';
      if (resultsContainer) resultsContainer.style.display = 'none';
      return;
    }

    const results = performSearch(query, rubricSlug, tags);
    renderResults(results, query, rubricSlug, tags);

    if (tipsContainer) tipsContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';
  }

  // Рендер результатов
  function renderResults(results, query, rubricSlug, tags) {
    if (!resultsContainer || !resultsList || !resultsInfo) return;

    const rubricName = rubricSlug ? (rubricsData.find(r => r.slug === rubricSlug)?.title || rubricSlug) : null;
    const tagsText = tags.length > 0 ? tags.join(', ') : null;

    let infoHtml = '';
    if (results.length === 0) {
      infoHtml = `По запросу "<strong>${escapeHtml(query)}</strong>"`;
      if (rubricName) infoHtml += ` в разделе "${escapeHtml(rubricName)}"`;
      if (tagsText) infoHtml += ` с тегами "${escapeHtml(tagsText)}"`;
      infoHtml += ' ничего не найдено';
    } else {
      infoHtml = `Найдено материалов: <strong>${results.length}</strong>`;
      if (rubricName) infoHtml += ` в разделе "${escapeHtml(rubricName)}"`;
      if (tagsText) infoHtml += ` с тегами "${escapeHtml(tagsText)}"`;
    }

    resultsInfo.innerHTML = infoHtml;

    if (results.length === 0) {
      resultsList.innerHTML = '<li class="search-no-results"><p>Попробуйте изменить запрос или убрать фильтры</p></li>';
      return;
    }

    resultsList.innerHTML = results.map(result => {
      const tagsHtml = Array.isArray(result.tags) && result.tags.length > 0
        ? `<div class="search-result-card__tags">${result.tags.slice(0, 5).map(t => `<span class="search-result-card__tag">${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

      const rubricHtml = result.rubric && result.rubric !== '0'
        ? `<span class="search-result-card__rubric">${escapeHtml(getRubricTitle(result.rubric))}</span>`
        : '';

      return `
        <li class="search-result-card">
          <h2 class="search-result-card__title">
            <a href="${escapeHtml(result.url)}">${highlightText(result.title, query)}</a>
          </h2>
          <p class="search-result-card__meta">
            ${result.date ? `<time datetime="${escapeHtml(result.date)}">${formatDate(result.date)}</time>` : ''}
            ${rubricHtml}
            ${result.category ? `<span class="search-result-card__category">${escapeHtml(result.category)}</span>` : ''}
          </p>
          <p class="search-result-card__excerpt">${highlightText(result.excerpt, query)}</p>
          ${tagsHtml}
        </li>
      `;
    }).join('');
  }

  // Получить название рубрики по коду
  function getRubricTitle(code) {
    if (!code) return '';
    for (const rubric of rubricsData) {
      if (rubric.code === code) return rubric.title;
      if (rubric.children) {
        for (const child of rubric.children) {
          if (child.code === code) return child.title;
          if (child.children) {
            for (const grandchild of child.children) {
              if (grandchild.code === code) return grandchild.title;
            }
          }
        }
      }
    }
    return code;
  }

  // Подсветка совпадений
  function highlightText(text, query) {
    if (!text || !query) return escapeHtml(text || '');

    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    let result = escapeHtml(text);

    words.forEach(word => {
      const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });

    return result;
  }

  // Форматирование даты
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  // Экранирование HTML
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Экранирование для RegExp
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Обработка формы поиска
  function handleSearchSubmit(e) {
    if (e) e.preventDefault();

    const query = searchInput ? searchInput.value.trim() : '';
    const urlQuery = new URLSearchParams(window.location.search).get('q');
    const urlRubric = new URLSearchParams(window.location.search).get('rubric');
    const urlTags = new URLSearchParams(window.location.search).get('tags');

    // Если это отправка формы с запросом, переходим на страницу поиска с параметрами
    if (e && query) {
      const params = new URLSearchParams();
      params.set('q', query);
      if (rubricFilter && rubricFilter.value) params.set('rubric', rubricFilter.value);
      if (selectedTags.size > 0) params.set('tags', Array.from(selectedTags).join(','));

      window.location.href = `/search/?${params.toString()}`;
      return;
    }

    // Если мы на странице поиска, выполняем поиск
    if (window.location.pathname === '/search/' || window.location.pathname === '/search') {
      // Восстанавливаем параметры из URL
      if (urlQuery && searchInput) searchInput.value = urlQuery;
      if (urlRubric && rubricFilter) rubricFilter.value = urlRubric;
      if (urlTags) {
        urlTags.split(',').forEach(tag => selectedTags.add(tag));
        // Обновляем UI тегов после загрузки
        setTimeout(() => {
          selectedTags.forEach(tag => {
            const label = tagsContainer?.querySelector(`[data-tag="${tag}"]`);
            if (label) {
              label.classList.add('active');
              const checkbox = label.querySelector('input');
              if (checkbox) checkbox.checked = true;
            }
          });
        }, 100);
      }

      const actualQuery = query || urlQuery;
      if (actualQuery) {
        loadSearchIndex().then(() => {
          performAndRenderSearch();
        });
      }
    }
  }

  // Обработчик изменения фильтра рубрики
  function handleRubricChange() {
    if (searchInput && searchInput.value.trim().length >= 2) {
      performAndRenderSearch();
    }
  }

  // Инициализация
  function init() {
    // Загружаем данные рубрик
    loadRubricsData();

    // Находим элементы
    searchForm = document.querySelector('.search-form');
    searchInput = document.querySelector('.search-form__input');
    rubricFilter = document.getElementById('rubricFilter');
    tagsContainer = document.getElementById('tagsFilter');
    resultsContainer = document.querySelector('.search-results');
    resultsInfo = document.querySelector('.search-results__info');
    resultsList = document.querySelector('.search-results__list');
    tipsContainer = document.querySelector('.search-tips');

    // Привязываем обработчики
    if (searchForm) {
      searchForm.addEventListener('submit', handleSearchSubmit);
    }

    if (rubricFilter) {
      rubricFilter.addEventListener('change', handleRubricChange);
    }

    // Если мы на странице поиска с параметром q, выполняем поиск
    if (window.location.pathname === '/search/' || window.location.pathname === '/search') {
      const urlQuery = new URLSearchParams(window.location.search).get('q');
      if (urlQuery) {
        handleSearchSubmit();
      }
    }
  }

  // Запуск при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Экспорт для отладки
  window.SiteSearch = {
    loadIndex: loadSearchIndex,
    search: performSearch,
    render: renderResults,
    performAndRender: performAndRenderSearch
  };
})();
