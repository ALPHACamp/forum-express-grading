const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // ex: total=55 limit=10 55/10=5.5 用Math.ceil小數點無條件進位，取出6的值。所以page=6
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // ****2組三元運算子，先讀後面那組
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
