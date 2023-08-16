// 偏移量 E.G.每頁 10 筆資料 Offset=10
const getOffset = (limit = 10, page = 1) => (page - 1) * limit
// 取 views 要用的參數
const getPagination = (limit = 10, page = 1, total = 50) => {
  // 總頁數
  const totalPage = Math.ceil(total / limit)
  // 總共有哪些頁面 [1,2,3,4,5] => 導覽器上的按鈕
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 目前位於第幾頁
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  // 取前頁
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 取後頁
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
