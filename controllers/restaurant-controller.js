const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('admin/restaurants')
  }
}

module.exports = restaurantController
