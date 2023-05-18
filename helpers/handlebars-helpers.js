const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

module.exports = {
  // 目前年份
  currentYear: () => dayjs().year(),

  // 相對時間 (使用relativeTime plugin)
  relativeTimeFromNow: date => dayjs(date).fromNow(),

  // 比較 a === b
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}

/*
基本的 helper不需要 # 開頭，以及 / 結尾，可直接使用
使用 # 代表是 block 區塊模式，這樣就必須使用 / 把來結尾

-- 以ifCond為例:
傳入的arguments用 空格 隔開而非一般的逗號
{{#ifCond inputA 'apple'}}
content in current block
{{/else}}
content in alternative block
{{/ifCond}}

helper parameter (inputA, inputB, options)
options.fn(this) : if condition is true, use the current block
options.inverse(this) : if condition is false, use the alternative block

使用 箭頭函式會把 this 訂到外層的 this, 所以在使用 options.fn(this)必須要寫成普通的 function
*/
