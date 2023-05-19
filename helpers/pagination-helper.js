// 取得offset
const getOffset = (limit = 10, page = 1) => (page - 1) * limit
// 取得頁數
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  // 1~totalPage的陣列
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 如果頁數大於totalPage就是totalPage，如果頁數小於1就是1
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  // 如果頁數-1小於1就為1
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 如果頁數+1大於totalPage就是totalPage
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return { totalPage, pages, currentPage, prev, next }
}

module.exports = {
  getOffset,
  getPagination
}
