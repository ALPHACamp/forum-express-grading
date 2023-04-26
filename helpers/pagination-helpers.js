const getOffset = (page, limit) => {
  return (page - 1) * limit
}

const getPagination = (total, page, limit) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (e, i) => i + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  const prev = (currentPage - 1) > 1 ? (currentPage - 1) : 1
  const next = (currentPage + 1) < totalPage ? (currentPage + 1) : totalPage
  return { pages, totalPage, currentPage, prev, next }
}

module.exports = {
  getOffset,
  getPagination
}