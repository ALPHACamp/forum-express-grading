const getOffset = (limit = 10, page = 1) => (page - 1) * limit // 偏移量定義

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 55/10 = 5.5 => 6
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  // 如果輸入的page小於1，則取用1，反之則取用page
  // 如果輸入的page大於totalpage，則取用totalpage，反之則取用page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 如果currentPage比1小，則prev就是1，反之就是currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  // 如果currentPage+1比totalPage大，則取用totalPage，反之則next取用currentPage+1
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
