module.exports = {
  eleventyComputed: {
    title: (data) => `Тег: ${data.tag && data.tag.name || ''}`,
    rubricTitle: (data) => `Тег: ${data.tag && data.tag.name || ''}`,
    description: (data) =>
      `Все публикации по тегу «${data.tag && data.tag.name || ''}» — Сальский индустриальный техникум`,
    breadcrumbs: (data) => [
      { text: 'Главная', url: '/' },
      { text: 'Новости', url: '/news/' },
      { text: 'Теги', url: '/tags/' },
      { text: (data.tag && data.tag.name) || '', url: null },
    ],
  },
};
