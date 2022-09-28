
const getOffSet = (page, limit) => { return (page - 1) * limit }
const getOpagination = (page, limit, total) => {
  const totalPage = Math.ceil(total / limit)
  const currentPage = page < 0 ? 1 : page > totalPage ? totalPage : page
  const prev = currentPage - 1 < 0 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)

  return {
    currentPage,
    pages,
    prev,
    next,
    totalPage
  }
}

// const pagination = {} //  {{currentPage,pages,prev,next,totalPage}}
module.exports = { getOffSet, getOpagination }
