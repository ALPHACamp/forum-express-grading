const adminController = {
  // 瀏覽後台網頁
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}

// 匯出模組
module.exports = adminController
