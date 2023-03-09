const getOffset = (limit = 10, page = 1) => (page - 1) * limit // 偏移量

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 有餘數則進位
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 指定陣列長度,每個位置都會被初始化為undefined, _ 同樣也為undefined
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // page > totalPage ? totalPage : page , page < 1 ? 1 : 前一組運算結果
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
