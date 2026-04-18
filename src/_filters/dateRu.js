module.exports = function(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};
