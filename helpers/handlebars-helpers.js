const dayjs = require('dayjs');
module.exports = {
  // note 利用dayjs套件取得當前年份
  currentYear: () => dayjs().year()
};
