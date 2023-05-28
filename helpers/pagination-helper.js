const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)// 資料要分成幾頁
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) //
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 兩組三元運算子，從後方開始算
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1 // "前一葉的邏輯"，若current-1小於1，救回傳1，其他則回傳currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1// "後一葉的邏輯"，若current+1大於totalPage，救回傳totalPage，其他則回傳currentPage + 1
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
