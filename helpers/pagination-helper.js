const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 總共頁數
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 頁數陣列「1、2、3、4、5」
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 是一個數值，代表當前是第幾頁，三元運算符，先算後再算前，意思如下
  // let currentPage
  // if (page < 1) {
  //   currentPage = 1
  // } else if (page > totalPage) {
  //   currentPage = totalPage
  // } else {
  //   currentPage = page
  // }
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1 // 前一頁是第幾頁
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1 // 下一頁是第幾頁
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
