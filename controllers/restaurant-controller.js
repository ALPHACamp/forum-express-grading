const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants') // go to restaurants.hbs
  }
}
module.exports = restaurantController
