// 前台restaurant專用的controller

const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
