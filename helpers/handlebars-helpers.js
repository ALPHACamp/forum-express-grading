// ***  該份helper可以將寫的條件輸出給hbs用，若是hbs的內建功能不夠的話可以另外寫給hbs用 */
const dayjs = require('dayjs');
module.exports = {
  // note 利用dayjs套件取得當前年份
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
};

//  Thinking 使用this的話，若是在箭頭function下，會直接對應到global environment，因此要回歸到傳統的function來指向object