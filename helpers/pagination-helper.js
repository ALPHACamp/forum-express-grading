// note 頁面偏移量計算 limit:限制有幾個instance顯示，offset：表要跳過多少個instance(From sequelize model)
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  // 計算總頁面
  const totalPage = Math.ceil(total / limit)

  // 根據上面產生空陣列後放入頁面數
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)

  // !! notice  兩層三元運算子，因此要由後面讀到前面，先執行 page > totalPage的判斷，再將判斷結果繼續比較page > 1
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page

  // paginator 的前端與尾端顯示邏輯
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
