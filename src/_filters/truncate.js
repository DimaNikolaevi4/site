/**
 * Фильтр для обрезки текста до указанной длины
 * @param {string} str - Исходный текст
 * @param {number} length - Максимальная длина (по умолчанию 150)
 * @returns {string} Обрезанный текст с многоточием
 */
module.exports = function(str, length = 150) {
  if (!str) return "";
  
  const string = String(str);
  if (string.length <= length) return string;
  
  return string.slice(0, length).trim() + "…";
};
