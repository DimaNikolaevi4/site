// Поиск по сайту с использованием Lunr.js с поддержкой фильтрации по рубрикам
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  const rubricSelect = document.querySelector('[data-rubric-select]');
  
  if (!searchForm || !searchInput) return;
  
  let searchIndex = null;
  let searchStore = {};
  let currentRubricFilter = '';
  
  // Загрузка индекса поиска
  async function loadSearchIndex() {
    try {
      const response = await fetch('/search-index.json');
      const data = await response.json();
      searchIndex = lunr.Index.load(data.index);
      searchStore = data.store || {};
    } catch (error) {
      console.error('Ошибка загрузки поискового индекса:', error);
    }
  }
  
  loadSearchIndex();
  
  // Обработчик выбора рубрики в поиске
  if (rubricSelect) {
    rubricSelect.addEventListener('change', function() {
      currentRubricFilter = this.value ? this.options[this.selectedIndex].getAttribute('data-code') || '' : '';
      const query = searchInput.value.trim();
      if (query && searchIndex) {
        performSearch(query);
      }
    });
  }
  
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query || !searchIndex) return;
    
    performSearch(query);
  });
  
  function performSearch(query) {
    let results = searchIndex.search(query);
    
    // Фильтрация по рубрике если выбрана
    if (currentRubricFilter) {
      results = results.filter(result => {
        const doc = searchStore[result.ref];
        return doc && doc.rubric && doc.rubric.startsWith(currentRubricFilter);
      });
    }
    
    displayResults(results);
  }
  
  function displayResults(results) {
    if (!searchResults) return;
    
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-no-results">Ничего не найдено.</p>';
      return;
    }
    
    const html = results.map(result => {
      const doc = searchStore[result.ref];
      const rubricInfo = doc.rubric ? `<span class="search-result-rubric">Рубрика: ${formatRubricCode(doc.rubric)}</span>` : '';
      
      return `
        <article class="search-result-item">
          <h3><a href="${doc.url}">${doc.title}</a></h3>
          ${rubricInfo}
          <p class="search-result-excerpt">${doc.excerpt || ''}</p>
        </article>
      `;
    }).join('');
    
    searchResults.innerHTML = `<div class="search-results-list">${html}</div>`;
  }
  
  function formatRubricCode(code) {
    // Форматирование кода рубрики для отображения
    const parts = code.split('.');
    if (parts.length === 1) return `Раздел ${code}`;
    if (parts.length === 2) return `Подраздел ${code}`;
    return `Рубрика ${code}`;
  }
});
