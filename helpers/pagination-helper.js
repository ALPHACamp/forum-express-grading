const getOffset = (limit = 10, page = 1) => {
  return (page - 1) * limit
}

const getPagination = (limit, page, total) => { // page是從1開始
  const totalPage = Math.ceil(total / limit)
  const currentPage = page < 1
    ? 1
    : page > totalPage
      ? totalPage
      : page
  const pages = Array.from({ length: totalPage }, (_, index) => {
    return index + 1
  })
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    currentPage,
    pages,
    prev,
    next
  }
}

module.exports = { getOffset, getPagination }
