/**
 * 文字列をキャメルケースへ変換
 * @param {string} str 変換する文字列
 * @param {boolean} [upper] 文字列の先頭も大文字にするかどうか
 * @return {string} 変換された文字列を返す
 */
export const toCamelcase = (str, upper) => {
  if (!str) return str;

  let strs = str.split(/[-_ ]+/),
    i = 1,
    len = strs.length;

  if (len <= 1) return str;

  if (upper) {
    i = 0;
    str = '';
  } else {
    str = strs[0].toLowerCase();
  }

  for (; i < len; i++) {
    str += strs[i].toLowerCase().replace(/^[a-z]/, function (value) {
      return value.toUpperCase();
    });
  }

  return str;
};
