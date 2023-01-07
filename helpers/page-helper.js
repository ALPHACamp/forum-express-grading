// 給function預設值，若傳入為undefind會自動啟用
const getOffset = (limit = 10, page = 1) => {
  return (page - 1) * limit
}

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPages = Math.ceil(total / limit)
  const pagesArr = Array.from({ length: totalPages }).map((_, i) => i + 1)
  const currentPage = (page < 1) ? 1 : (page > totalPages) ? totalPages : page
  // 以上一行＝下面程式碼的縮寫
  // let currentPage
  // if (page > totalPages) {
  //   currentPage = totalPages
  // } else if (page < 1) {
  //   currentPage = 1
  // } else {
  //   currentPage = page
  // }
  const prev = (currentPage - 1 > 0) ? currentPage - 1 : 1
  // 以上一行＝下面程式碼的縮寫
  // let prev
  // if (currentPage - 1 <= 0) {
  //   prev = '#'
  // } else {
  //   prev = currentPage - 1
  // }
  const next = (currentPage + 1 > totalPages) ? totalPages : currentPage + 1

  return {
    currentPage,
    totalPages,
    pagesArr,
    prev,
    next
  }
}

module.exports = {
  getOffset,
  getPagination
}
