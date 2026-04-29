module.exports = {
  eleventyComputed: {
    title: (data) => {
      const n = (data.pagination && data.pagination.pageNumber || 0) + 1;
      return n > 1 ? `Новости — страница ${n}` : 'Новости';
    },
    description: (data) => {
      const n = (data.pagination && data.pagination.pageNumber || 0) + 1;
      return n > 1
        ? `Все новости Сальского индустриального техникума — страница ${n}`
        : 'Все новости Сальского индустриального техникума';
    },
    breadcrumbs: (data) => {
      const n = (data.pagination && data.pagination.pageNumber || 0) + 1;
      const crumbs = [
        { text: 'Главная', url: '/' },
        { text: 'Новости', url: n > 1 ? '/news/' : null },
      ];
      if (n > 1) crumbs.push({ text: `Страница ${n}`, url: null });
      return crumbs;
    },
  },
};
