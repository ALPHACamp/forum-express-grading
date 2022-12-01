const dayjs = require('dayjs')
const { isSuperuser } = require('./superuser-helper')
// Day.js 本身附帶relativeTime 的 plugin，載入後用 extend即可使用dayjs().fromNow()
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 傳入時間參數a，dayjs(a).fromNow()會把絕對時間轉換成相對描述
  currentYear: () => dayjs().year(),
  fixRoleSetting: email => isSuperuser(email) ? 'disabled' : null,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
