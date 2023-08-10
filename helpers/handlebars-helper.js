// 這隻檔案的使用在app.js設定的 -> app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelper }))

const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  // 注意這邊不能用箭頭函式，因使用this會有問題
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
