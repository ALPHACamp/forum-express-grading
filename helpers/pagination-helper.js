// 分頁計算

// 偏移量。計算每頁的起始數字，limit一頁分幾個,page頁數
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 分頁的數量，給予預設值
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 總共幾頁，無條件進位
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)// 根據總頁數，渲染幾頁
  // 因為陣列的每個位置都會被初始化undefined，(_,index)裡的_為undefined
  const currentPage = page > 1 ? 1 : page > totalPage ? totalPage : page// 如果頁數<1，則頁數是否大於totalPage。yes,print totalPage.no,print page
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1

  return { totalPage, pages, currentPage, prev, next }
}
module.exports = { getOffset, getPagination }
