const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(), // 導出時間年分

  buttonText: user => { // 管理使用者按鈕文字
    if (user.isAdmin === 0) return 'set as admin'
    if (user.isAdmin === 1) return 'set as user'
  }
}
