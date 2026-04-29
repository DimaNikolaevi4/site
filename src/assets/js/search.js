/**
 * Клиентский поиск с Lunr.js
 * Работает на статическом сайте: загружает JSON-индекс и выполняет поиск в браузере
 */
(function() {
  'use strict';

  // Состояние поиска
  let searchIndex = null;
  let searchDocuments = [];
  let isLoading = false;
  let isLoaded = false;

  // Элементы DOM (инициализируются при загрузке)
  let searchForm = null;
  let searchInput = null;
  let resultsContainer = null;
  let resultsInfo = null;
  let resultsList = null;
  let tipsContainer = null;

  // Русский стеммер для Lunr.js
  function registerRussianStemmer() {
    if (typeof lunr === 'undefined') return;

    lunr.registerMultiLanguage('ru', 'en');
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
      console.log('Search index loaded:', searchDocuments.length, 'documents');
    } catch (error) {
      console.error('Error loading search index:', error);
    } finally {
      isLoading = false;
    }
  }

  // Выполнение поиска
  function performSearch(query) {
    if (!searchIndex || !query || query.trim().length < 2) {
      return [];
    }

    try {
      // Подготавливаем запрос (убираем спецсимволы, добавляем wildcard)
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

      // Сопоставляем результаты с документами
      return results.slice(0, 50).map(result => {
        const doc = searchDocuments.find(d => d.id === result.ref);
        return doc ? { ...doc, score: result.score } : null;
      }).filter(Boolean);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Рендер результатов
  function renderResults(results, query) {
    if (!resultsContainer || !resultsList || !resultsInfo) return;

    if (results.length === 0) {
      resultsInfo.innerHTML = `По запросу "<strong>${escapeHtml(query)}</strong>" ничего не найдено`;
      resultsList.innerHTML = '';
      return;
    }

    resultsInfo.innerHTML = `Найдено материалов: <strong>${results.length}</strong>`;

    resultsList.innerHTML = results.map(result => `
      <li class="search-result-card">
        <h2 class="search-result-card__title">
          <a href="${escapeHtml(result.url)}">${highlightText(result.title, query)}</a>
        </h2>
        <p class="search-result-card__meta">
          ${result.date ? `<time datetime="${escapeHtml(result.date)}">${formatDate(result.date)}</time>` : ''}
          ${result.category ? `<span class="search-result-card__category">${escapeHtml(result.category)}</span>` : ''}
        </p>
        <p class="search-result-card__excerpt">${highlightText(result.excerpt, query)}</p>
      </li>
    `).join('');
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

    // Если это отправка формы, переходим на страницу поиска
    if (e && query) {
      window.location.href = `/search/?q=${encodeURIComponent(query)}`;
      return;
    }

    // Если мы на странице поиска, выполняем поиск
    if (window.location.pathname === '/search/' || window.location.pathname === '/search') {
      if (urlQuery && searchInput) {
        searchInput.value = urlQuery;
      }

      if (query || urlQuery) {
        const actualQuery = query || urlQuery;
        loadSearchIndex().then(() => {
          const results = performSearch(actualQuery);
          renderResults(results, actualQuery);
          if (tipsContainer) tipsContainer.style.display = 'none';
          if (resultsContainer) resultsContainer.style.display = 'block';
        });
      }
    }
  }

  // Инициализация
  function init() {
    // Находим элементы
    searchForm = document.querySelector('.search-form');
    searchInput = document.querySelector('.search-form__input');
    resultsContainer = document.querySelector('.search-results');
    resultsInfo = document.querySelector('.search-results__info');
    resultsList = document.querySelector('.search-results__list');
    tipsContainer = document.querySelector('.search-tips');

    // Привязываем обработчик формы
    if (searchForm) {
      searchForm.addEventListener('submit', handleSearchSubmit);
    }

    // Если мы на странице поиска с параметром q, выполняем поиск
    if (window.location.pathname === '/search/' || window.location.pathname === '/search') {
      const urlQuery = new URLSearchParams(window.location.search).get('q');
      if (urlQuery) {
        handleSearchSubmit();
      }
    }

    // Регистрируем русский стеммер
    registerRussianStemmer();
  }

  // Запуск при готовности DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Экспортируем для отладки
  window.SiteSearch = {
    loadIndex: loadSearchIndex,
    search: performSearch,
    render: renderResults
  };
})();
