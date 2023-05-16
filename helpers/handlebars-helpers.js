const dayjs = require('dayjs')

module.exports = {
  currentYear: () => {
    return dayjs().year()
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

/* 基本的 helper不需要 # 開頭，以及 / 結尾，可直接使用
當然你仍可以用一般的helper方式，並在中間夾入你要的HTML結構
使用 # 代表是 block，這樣就必須使用 / 把來結尾
以addUp為例:
{{ #addUp }}
{{ this }}
{{/addUp}}
傳入的arguments用 空格 隔開而非一般的逗號
*/

/*
helper parameter (inputA, inputB, options)
options.fn(this) : if condition is true, use the current block
options.inverse(this) : if condition is false, use the alternative block
*/

/*
使用 箭頭函式會把 this 訂到外層的 this, 所以在使用 options.fn(this) 的時候必能使用
必須要寫成普通的 function
*/
