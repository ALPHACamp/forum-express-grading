const dayjs = require('dayjs') // 載入 dayjs 套件

const currentYear = () => dayjs().year()
// 取得當年年份作為 currentYear 的屬性值，並導出

module.exports = {
  currentYear
}
