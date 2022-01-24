const restaurantController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

// 匯出模組
module.exports = restaurantController
