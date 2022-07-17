// limit = 10: 10 data pre page
// offset: 0, 10, 20, ...
const getOffset = (limit = 10, page = 1) => (page - 1) * limit
const getPagination = (limit = 10, page = 1, total = 50) => {
  // totalPage: Number
  const totalPage = Math.ceil(total / limit)

  // pages: Array
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)

  /*
    step 1. page > totalPage
            T: value is totalPage
            F: value is page
    step 2. page < 1
            T: value is 1
            F: value defined on step 1.
  */
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page

  // limitting the boundary to ensure page numbers between 1 to totalPage
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next,
  }
}

module.exports = {
  getOffset,
  getPagination,
}
