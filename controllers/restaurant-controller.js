// 前台使用者用
const restaurantController = {
  getRestaurants: (req, res) => {
    res.render('restaurants')
  }
}

module.exports = restaurantController
