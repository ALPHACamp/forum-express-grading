// - 處理屬於restaurant路由的相關請求
const adminController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants') // - render admin版的頁面
  }
}

module.exports = adminController
