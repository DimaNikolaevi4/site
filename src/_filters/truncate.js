module.exports = function(str, length) {
  if (!str) return "";
  const len = parseInt(length) || 150;
  if (str.length <= len) return str;
  return str.substring(0, len).replace(/\s+\w+$/, "") + "...";
};
