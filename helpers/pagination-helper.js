const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 無條件進位
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 產生陣列
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 頁數是否小於１，是的話１，不是的話確認頁數是否大於總頁數，是的話 總頁數， 不是的話 頁數
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
