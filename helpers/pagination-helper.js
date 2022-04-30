const getOffset = (limit = 10, page = 1) => ((page - 1) * limit)
const getPagination = (limit = 10, page = 1, total = 50) => {
  // 無條件進位
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 從後面讀到前的兩組三元運算 , page是從query-string取得
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

module.exports = { getOffset, getPagination }
