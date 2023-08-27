const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const { defaultAvatarPath } = require('./file-helper')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 導出時間年分
  relativeTimeFromNow: time => dayjs(time).fromNow(),

  buttonText: user => { // 管理使用者按鈕文字
    if (user.isAdmin === 0) return 'set as admin'
    if (user.isAdmin === 1) return 'set as user'
  },

  ifCond: function (a, b, options) { // 不能用箭頭函式，否則this會指向外部
    return a === b ? options.fn(this) : options.inverse(this) // 注意這個this會指向ifCont
  },
  defaultAvatarPath
}
