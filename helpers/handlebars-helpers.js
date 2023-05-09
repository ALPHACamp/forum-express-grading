const dayjs = require('dayjs')

module.exports = {
  currentYear: () => {
    return dayjs().year()
  }
}

/* 客製的helper不需要 # 開頭，以及 / 結尾，可直接使用
當然你仍可以用一般的helper方式，並在中間夾入你要的HTML結構
使用 # 代表是 block，這樣就必須使用 / 把來結尾
以addUp為例:
{{ #addUp }}
{{ this }}
{{/addUp}}
傳入的arguments用 空格 隔開而非一般的逗號
*/
