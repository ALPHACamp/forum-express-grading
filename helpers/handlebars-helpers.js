const dayjs = require('dayjs') // 載入 dayjs 套件
module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this) // 三元運算子來簡化 if/else 流程，若 a 和 b 相等，會回傳 options.fn(this)，不相等則回傳 options.inverse(this), handlebars語法：fn 取得options內容, inverse 取得相反內容
  }
}

// 為何ifCond 不用 arrow function? Answer:  Don’t use ES6 arrow functions to define helpers because Handlebars helpers use this as the context of the template execution
