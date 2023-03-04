const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPages = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const currentPage = getCurrentPage(page, totalPages)
  const prev = currentPage - 1 < 0 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  return {
    pages,
    totalPages,
    currentPage,
    prev,
    next
  }
}

function getCurrentPage (page, totalPages) {
  let currentPage = 1 // - 預設第一頁
  if (page < 1) return currentPage
  currentPage = page > totalPages ? totalPages : page
  return currentPage
}

module.exports = {
  getOffset,
  getPagination
}
