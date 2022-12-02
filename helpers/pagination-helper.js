module.exports = {
  // controller 使用
  getOffset: (limit = 10, page = 1) => (page - 1) * limit,
  getPagination: (limit = 10, page = 1, total = 50) => {
    const totalPage = Math.ceil(total / limit)
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

}
