module.exports = {
  getOffset: (limit = 10, page = 1) => (page - 1) * limit,
  getPagination: (total = 50, limit = 10, page = 1) => {
    const totalPage = Math.ceil(total / limit) // 得到總共要幾頁
    const pages = Array.from({ length: totalPage }, (_, i) => i + 1) // 得到頁數的array -> handlebars render用
    const currentPage = page
    const prevPage = (page > 1) ? page - 1 : page
    const nextPage = (page < totalPage) ? page + 1 : page

    return { pages, currentPage, prevPage, nextPage }
  }
}
