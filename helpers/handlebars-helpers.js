const dayjs = require('dayjs')
module.exports = {
  currentYear: dayjs().year() // 目前日期的總數字.只要年並轉成易讀型 dayjs() === new date()
}
