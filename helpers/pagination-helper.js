// 計算當前page的offset
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 計算pagination物件值
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 總筆數/limit 無條件進位為總頁數
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // 將每頁以陣列形式顯示
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // 傳入page參數 < 1則回傳 1， 大於總頁數回傳總頁數，否則回傳page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1 // 當前頁數 - 1 < 1回傳1，否則回傳當前頁數 - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1 // 當前頁數 + 1大於總頁數回傳總頁數，否則回傳當前頁數 + 1

  return {
    totalPage,
    pages,
    currentPage,
    prev,
    next
  }
}

// 匯出模組
module.exports = {
  getOffset,
  getPagination
}
