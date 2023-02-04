// - 處理屬於restaurant路由的相關請求
const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
