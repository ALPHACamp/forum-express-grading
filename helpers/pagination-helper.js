const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page //從後面往前讀
  // if 寫法 -> currentPage
  // let currentPage
  // if (page < 1) {
  //   currentPage = 1
  // }else if (page > totalPage) {
  //   currentPage = totalPage
  // }else{
  //   currentPage = page
  // }
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
