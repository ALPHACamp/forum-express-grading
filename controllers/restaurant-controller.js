const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants.hbs')
  }
}

module.exports = restaurantController