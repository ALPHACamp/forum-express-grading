
/**
* @param {Number} limit
* @param {Number} currentPage
* @return {Number}
**/
function getOffset (limit = 10, currentPage = 1) {
  return (currentPage - 1) * limit
}

/**
* @param {Number} limit
* @param {Number} page
* @param {Number} getPagination
* @return {Object}
**/
function getPagination (limit = 10, currentPage = 1, totalRecord = 50) {
  const totalPage = Math.ceil(totalRecord / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // obtain current page
  currentPage = currentPage < 1 ? 1 : currentPage > totalPage ? totalPage : currentPage
  // obtain previous page
  const prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1
  // obtain next page
  const nextPage = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    totalPage,
    pages,
    currentPage,
    prevPage,
    nextPage
  }
}

exports = module.exports = {
  getOffset,
  getPagination
}
