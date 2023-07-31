const currentYear = () => {
  const yearNow = new Date().getFullYear()
  return yearNow
}
const ifCond = function (a, b, options) { // 不要用箭頭，箭頭的this在function建立時就定下來了
  if (a === b) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
module.exports = { currentYear, ifCond }
