// 得到忽略的總資料量 (e.g. 10 筆、20 筆)
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 得到 1.總頁數 2.頁碼 3. 頁碼的 prev 頁碼 4.頁碼的 next 頁碼
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // e.g. 3.5 無條件進位

  // 從 totalPage 製作要渲染的頁碼陣列(頁碼從 1 開始，所以整個陣列要 + 1，map 出內容是 index + 1 的陣列，用 index 的原因是因為 array.from 內容是空的，只有 index 有內容，所以用 index )
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)

  // page > totalPage ? totalPage : page -> 新進 page 有大於最後一頁嗎? 有的話就改成最後一頁 ( 避免當有心人士要竄改數字時及時擋下，不要讓對方成功，所以在這邊檢查 )
  // page < 1 ? 1 : page(前一組運算結果) -> 新進的 page 有大於 1 嗎? 有就改成新進的 page ( 避免當有心人士要竄改數字時及時擋下，不要讓對方成功，所以在這邊檢查 )
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page

  // 製作出 prev 在當前頁面所代表的頁碼，並檢查往前 - 1 會不會超出 1
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1

  // 製作出 next 在當前頁面所代表的頁碼，並檢查往後 + 1會不會超出 totalPage
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return {
    pages, // 所有頁數陣列
    totalPage, // 最後一個頁碼
    currentPage, // 現在頁碼
    prev, // 代表 prev 頁碼
    next // 代表 next 頁碼
  }
}

module.exports = {
  getOffset,
  getPagination
}