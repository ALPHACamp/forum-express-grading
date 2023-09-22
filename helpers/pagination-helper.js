module.exports = {
  getOffset (limit = 10, page = 1) {
    return limit * (page - 1)
  },
  getPagination (limit = 10, page = 1, total = 50) {
    const totalPage = Math.ceil(total / limit)
    const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
    const currentPage = page > totalPage ? totalPage : page < 1 ? 1 : page
    const prev = currentPage === 1 ? 1 : currentPage - 1
    const next = currentPage === totalPage ? totalPage : currentPage + 1

    return { totalPage, pages, currentPage, prev, next }
  }
}
