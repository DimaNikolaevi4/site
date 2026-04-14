// Поиск по сайту с использованием Lunr.js
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  if (!searchForm || !searchInput) return;

  let searchIndex = null;

  // Загрузка индекса поиска
  async function loadSearchIndex() {
    try {
      const response = await fetch('/search-index.json');
      const data = await response.json();
      searchIndex = lunr.Index.load(data);
    } catch (error) {
      console.error('Ошибка загрузки поискового индекса:', error);
    }
  }

  loadSearchIndex();

  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query || !searchIndex) return;

    const results = searchIndex.search(query);
    displayResults(results);
  });

  function displayResults(results) {
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-no-results">Ничего не найдено.</p>';
      return;
    }

    const html = results.map(result => {
      const doc = searchIndex.store[result.ref];
      return `
        <article class="search-result-item">
          <h3><a href="${doc.url}">${doc.title}</a></h3>
          <p class="search-result-excerpt">${doc.excerpt || ''}</p>
        </article>
      `;
    }).join('');

    searchResults.innerHTML = `<div class="search-results-list">${html}</div>`;
  }
});
