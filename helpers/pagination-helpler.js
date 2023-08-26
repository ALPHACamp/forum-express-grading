const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  // Array.from 接受長度物件跟元素回調函式，回調接受value,index
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1)
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page
  //                 (page < 1 ) ? 1 : ( (page > totalPage) ? totalPage : page )
  //                  Math.min(Math.max(page, 1), totalPage);
  const pre = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    totalPage,
    pages,
    currentPage,
    pre,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
