const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // totalPage - 是一個數值，代表總共有幾頁
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // pages - 是一個陣列,{ length: totalPage }指定陣列長度
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // currentPage - 是一個數值，代表當前是第幾頁。
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1 // prev ，代表前一頁是第幾頁。
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1 // next 代表下一頁是第幾頁。
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
