const restaurantController = {
  getRestaurants: (req, res) => {
    res.locals.user = req.user.dataValues
    return res.render('restaurants')
  }
}
module.exports = restaurantController
