const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  // 取得當年年份作為 currentYear 的屬性值，並導出
  currentYear: () => dayjs().year()
}
