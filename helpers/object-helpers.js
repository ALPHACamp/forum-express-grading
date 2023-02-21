module.exports = {
  removesWhitespace: obj => {
    // 遍歷傳入的 obj，將val前後的空白移除 or val本身為空白則回傳undefined
    // 回傳值為新的 obj
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
      return (val) ? [key, val.trim()] : [key, undefined] // 資料庫欄位為undefined將會採用預設值（name: '未命名'）
    }))
  }
}
