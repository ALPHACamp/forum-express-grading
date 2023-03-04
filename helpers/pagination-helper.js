const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPages = Math.ceil(total / limit)
  const OFFSET_OF_PAGES = 4
  const CRITICAL_PAGES = 6
  const currentPage = getCurrentPage(page, totalPages)
  let fromPage = currentPage - 2 < 1 ? 1 : currentPage - 2
  let untilPage = fromPage + OFFSET_OF_PAGES
  if (untilPage > totalPages) {
    untilPage = totalPages
    fromPage = untilPage - OFFSET_OF_PAGES < 1 ? 1 : untilPage - OFFSET_OF_PAGES
  }
  const showFirstPage = fromPage > 1 && totalPages > CRITICAL_PAGES
  const hideExcessiveStartPages = fromPage > 2 && totalPages > CRITICAL_PAGES
  const hideExcessiveEndPages =
    untilPage < totalPages - 1 && totalPages > CRITICAL_PAGES
  const showLastPage = untilPage < totalPages && totalPages > CRITICAL_PAGES
  const pages = Array.from(
    { length: untilPage - fromPage + 1 },
    (_, index) => index + fromPage
  )
  const prev = currentPage - 1 < 0 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPages ? totalPages : currentPage + 1
  return {
    pages,
    totalPages,
    currentPage,
    prev,
    next,
    showFirstPage,
    hideExcessiveStartPages,
    hideExcessiveEndPages,
    showLastPage
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
