/**
 * Фильтр для форматирования даты на русском языке
 * @param {Date|string} dateObj - Дата для форматирования
 * @returns {string} Форматированная дата (ДД.ММ.ГГГГ)
 */
module.exports = function(dateObj) {
  if (!dateObj) return "";
  
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return "";
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}.${month}.${year}`;
};
