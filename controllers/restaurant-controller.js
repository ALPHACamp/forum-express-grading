const restaurantController = {
  // getRestaurants => 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restaurantController
