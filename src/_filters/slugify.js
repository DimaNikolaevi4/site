const cyrillicMap = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
  'з':'z','и':'i','й':'j','к':'k','л':'l','м':'m','н':'n','о':'o',
  'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c',
  'ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
};

module.exports = function(str) {
  if (!str) return "";
  let s = String(str).toLowerCase();
  s = s.replace(/[а-яё]/g, ch => cyrillicMap[ch] !== undefined ? cyrillicMap[ch] : ch);
  s = s.replace(/[^a-z0-9\s-]/g, '');
  s = s.replace(/[\s_-]+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  return s;
};
