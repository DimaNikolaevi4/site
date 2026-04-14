const lunr = require('lunr');

module.exports = function(collection) {
  const documents = collection.map(item => ({
    id: item.url,
    title: item.data.title || '',
    content: item.templateContent || '',
    date: item.date || ''
  }));

  const idx = lunr(function() {
    this.ref('id');
    this.field('title');
    this.field('content');
    this.field('date');

    documents.forEach(doc => {
      this.add(doc);
    });
  });

  return idx;
};
