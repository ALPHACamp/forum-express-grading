// 送出查詢之前要用的
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 查詢完畢拿到資料庫回傳的資料後，要用getPagination整理一包資料再丟給view(restaurants.hbs)的
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 一個陣列
  let currentPage
  if (page < 1) {
    currentPage = 1
  } else if (page > totalPage) {
    currentPage = totalPage
  } else {
    currentPage = page
  }
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

module.exports = {
  getOffset,
  getPagination
}
