const restaurantController = {
  getRestaurants: async (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
