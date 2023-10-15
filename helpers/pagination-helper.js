// 需要的parameters： pagination中的以下內容 pages, currentPage, prev、next 和 totalPage。

const getOffset = (limit = 10, page = 1) => (page - 1) * limit
// 先定義好 limit: 一頁渲染幾筆資料; page：前端req的頁數; total：總共有幾筆資料 的值，避免使用者亂填資料
// 使用 Sequlize 查詢資料時，可以直接指定 offset 和 limit，它就會幫你取出需要的資料
const getPagination = (limit = 10, page = 1, total = 50) => {
  // pages, currentPage, prev、next 和 totalPage
  const totalPage = Math.ceil(total / limit)
  // pages: 把totalPage變成陣列：[1,2,3,.....]
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
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
